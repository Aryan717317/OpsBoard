import { create } from 'zustand';
import type { Task, Column } from '../types';
import { socket, API_URL } from '../lib/socket';

interface Filters {
    userId?: string;
    teamId?: string;
    boardId?: string;
}

interface BoardState {
    columns: Column[];
    tasks: Task[];
    filters: Filters;
    setFilters: (filters: Partial<Filters>) => void;
    setTasks: (tasks: Task[]) => void;
    moveTask: (taskId: string, targetColumnId: string) => void;
    fetchTasks: () => Promise<void>;
    createTask: (data: {
        title: string,
        priority: 'High' | 'Medium' | 'Low',
        columnId: string,
        teamId?: string,
        assigneeIds?: string[]
    }) => Promise<void>;
    updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
}

export const useBoardStore = create<BoardState>((set, get) => ({
    // ... (previous state)
    columns: [
        { id: 'backlog', title: 'Backlog', color: 'bg-indigo-500' },
        { id: 'inprogress', title: 'In Progress', color: 'bg-blue-500', wipLimit: 5 },
        { id: 'testing', title: 'Testing', color: 'bg-yellow-500' },
        { id: 'done', title: 'Done', color: 'bg-green-500' },
    ],
    tasks: [],
    filters: {},

    setFilters: (newFilters) => {
        set(state => ({ filters: { ...state.filters, ...newFilters } }));
        get().fetchTasks(); // Refetch on filter change
    },

    fetchTasks: async () => {
        try {
            const { filters } = get();
            const params = new URLSearchParams();
            if (filters.userId) params.append('userId', filters.userId);
            if (filters.teamId) params.append('teamId', filters.teamId);
            if (filters.boardId) params.append('boardId', filters.boardId);

            const res = await fetch(`${API_URL}/api/boards?${params.toString()}`);
            const data = await res.json();

            // Collect all tasks and columns from all boards
            const allTasks: Task[] = [];

            data.forEach((board: any) => {
                board.columns.forEach((col: any) => {
                    allTasks.push(...col.tasks.map((t: any) => ({ ...t, boardId: board.id })));
                });
            });

            // For the demo/simplified view, we take columns from the first board or use defaults
            const board = data[0];
            if (board) {
                set({
                    tasks: allTasks,
                    columns: board.columns.map((col: any) => ({
                        id: col.id,
                        title: col.title,
                        color: col.title === 'Backlog' ? 'bg-indigo-500'
                            : col.title === 'In Progress' ? 'bg-blue-500'
                                : col.title === 'Testing' ? 'bg-yellow-500'
                                    : 'bg-green-500',
                        wipLimit: col.wipLimit
                    }))
                });
            }
        } catch (e) {
            console.error("Failed to fetch tasks", e);
        }
    },

    createTask: async (taskData) => {
        try {
            const res = await fetch(`${API_URL}/api/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });
            const newTask = await res.json();

            set(state => {
                if (state.tasks.some(t => t.id === newTask.id)) {
                    return state;
                }
                return { tasks: [...state.tasks, newTask] };
            });
        } catch (e) {
            console.error("Failed to create task", e);
        }
    },

    updateTask: async (taskId, updates) => {
        try {
            // Optimistic Update
            set(state => ({
                tasks: state.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
            }));

            await fetch(`${API_URL}/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
        } catch (e) {
            console.error("Failed to update task", e);
        }
    },

    deleteTask: async (taskId) => {
        try {
            // Optimistic Update
            set(state => ({
                tasks: state.tasks.filter(t => t.id !== taskId)
            }));

            await fetch(`${API_URL}/api/tasks/${taskId}`, {
                method: 'DELETE'
            });
        } catch (e) {
            console.error("Failed to delete task", e);
        }
    },

    setTasks: (tasks) => set({ tasks }),

    moveTask: (taskId, targetColumnId) => {
        const { tasks } = get();
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        set({
            tasks: tasks.map(t => t.id === taskId ? { ...t, columnId: targetColumnId as any } : t)
        });

        const newPosition = Date.now();
        fetch(`${API_URL}/api/tasks/${taskId}/move`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetColumnId, newPosition })
        }).catch(console.error);
    },
}));

socket.on('task:moved', (updatedTask: any) => {
    useBoardStore.setState((state) => ({
        tasks: state.tasks.map(t => t.id === updatedTask.id ? { ...t, columnId: updatedTask.columnId } : t)
    }));
});

socket.on('task:created', (newTask: any) => {
    useBoardStore.setState((state) => {
        if (state.tasks.some(t => t.id === newTask.id)) {
            return state;
        }
        return { tasks: [...state.tasks, newTask] };
    });
});

socket.on('task:updated', (updatedTask: any) => {
    useBoardStore.setState((state) => ({
        tasks: state.tasks.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } : t)
    }));
});

socket.on('task:deleted', (deletedTaskId: string) => {
    useBoardStore.setState((state) => ({
        tasks: state.tasks.filter(t => t.id !== deletedTaskId)
    }));
});
