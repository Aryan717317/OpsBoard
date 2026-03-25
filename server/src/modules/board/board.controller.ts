
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

// In-Memory Storage (Temporary Checkpoint)
// Mock Data for Filtering
const MOCK_USERS: any[] = [];
const MOCK_TEAMS: any[] = [];

let MOCK_BOARDS = [
    {
        id: 'board-1',
        title: 'OpsBoard',
        teamId: 'team-alpha',
        columns: [
            { id: 'backlog', title: 'Backlog', color: 'bg-indigo-500', tasks: [] },
            { id: 'inprogress', title: 'In Progress', color: 'bg-blue-500', wipLimit: 5, tasks: [] },
            { id: 'testing', title: 'Testing', color: 'bg-yellow-500', tasks: [] },
            { id: 'done', title: 'Done', color: 'bg-green-500', tasks: [] }
        ]
    },
    {
        id: 'board-2',
        title: 'Engineering',
        teamId: 'team-beta',
        columns: [
            { id: 'backlog', title: 'Backlog', color: 'bg-indigo-500', tasks: [] },
            { id: 'inprogress', title: 'In Progress', color: 'bg-blue-500', wipLimit: 3, tasks: [] },
            { id: 'done', title: 'Done', color: 'bg-green-500', tasks: [] }
        ]
    }
];

let MOCK_TASKS: any[] = [
    { id: 't1', title: 'Task 1: System Live', priority: 'High', columnId: 'backlog', boardId: 'board-1', teamId: 'Team Alpha', assigneeIds: ['Alex'], position: 1000 },
    { id: 't2', title: 'Task 2: Debug Auth', priority: 'Medium', columnId: 'inprogress', boardId: 'board-1', teamId: 'Team Alpha', assigneeIds: ['Mia'], position: 2000 },
    { id: 't3', title: 'Task 3: Engineering Sync', priority: 'Low', columnId: 'backlog', boardId: 'board-2', teamId: 'Team Beta', assigneeIds: ['John'], position: 3000 }
];

const CreateTaskSchema = z.object({
    title: z.string().min(1),
    priority: z.enum(['High', 'Medium', 'Low']).default('Medium'),
    columnId: z.string(),
    teamId: z.string().optional(),
    assigneeIds: z.array(z.string()).optional()
});

const MoveTaskSchema = z.object({
    targetColumnId: z.string(),
    newPosition: z.number().optional()
});

const UpdateTaskSchema = z.object({
    title: z.string().min(1).optional(),
    priority: z.enum(['High', 'Medium', 'Low']).optional(),
    columnId: z.string().optional(),
    teamId: z.string().optional(),
    assigneeIds: z.array(z.string()).optional()
});

const hydrateTask = (task: any) => ({
    ...task,
    assignees: (task.assigneeIds || []).map((name: string) => ({
        id: name,
        name: name,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    }))
});

export const BoardController = {
    getBoards: async (req: FastifyRequest, reply: FastifyReply) => {
        const query = req.query as { userId?: string, teamId?: string, boardId?: string };

        // Filter tasks based on query
        let filteredTasks = [...MOCK_TASKS];
        if (query.userId) {
            filteredTasks = filteredTasks.filter(t => t.assigneeIds?.includes(query.userId));
        }
        if (query.teamId) {
            filteredTasks = filteredTasks.filter(t => t.teamId === query.teamId);
        }
        if (query.boardId) {
            filteredTasks = filteredTasks.filter(t => t.boardId === query.boardId);
        }

        // Hydrate boards with tasks
        const boardsWithTasks = MOCK_BOARDS.map(b => ({
            ...b,
            columns: b.columns.map(c => ({
                ...c,
                tasks: filteredTasks
                    .filter(t => t.columnId === c.id && t.boardId === b.id)
                    .map(hydrateTask)
            }))
        }));

        // In OpsBoard mode, if filtering by board, we only return that board
        // If "All Boards", we return all
        return query.boardId ? boardsWithTasks.filter(b => b.id === query.boardId) : boardsWithTasks;
    },

    getUsers: async (req: FastifyRequest, reply: FastifyReply) => {
        const allAssignees = MOCK_TASKS.flatMap(t => t.assigneeIds || []);
        const uniqueNames = Array.from(new Set(allAssignees));
        return uniqueNames.map(name => ({
            id: name,
            name: name,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        }));
    },

    getTeams: async (req: FastifyRequest, reply: FastifyReply) => {
        const allTeams = MOCK_TASKS.map(t => t.teamId).filter(Boolean);
        const uniqueTeams = Array.from(new Set(allTeams));
        return uniqueTeams.map(name => ({
            id: name,
            name: name
        }));
    },

    createBoard: async (req: FastifyRequest, reply: FastifyReply) => {
        return MOCK_BOARDS[0];
    },

    createTask: async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { title, priority, columnId, teamId, assigneeIds } = CreateTaskSchema.parse(req.body);

            // In dynamic mode, we use the teamId string directly as the team name.
            // We'll still default to board-1 for visibility if no board matches the team name.
            let boardId = 'board-1';

            const newTask = {
                id: `task-${Date.now()}`,
                title,
                priority,
                columnId,
                boardId,
                teamId: teamId || 'General',
                assigneeIds: assigneeIds || [],
                position: Date.now(),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            MOCK_TASKS.push(newTask);
            return hydrateTask(newTask);
        } catch (e: any) {
            console.error("Task Creation Error:", e);
            return reply.status(400).send({ error: e.message });
        }
    },

    updateTask: async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        try {
            const { id } = req.params;
            const updates = UpdateTaskSchema.parse(req.body);

            const taskIndex = MOCK_TASKS.findIndex(t => t.id === id);
            if (taskIndex === -1) return reply.status(404).send({ error: "Task not found" });

            const updatedTask = {
                ...MOCK_TASKS[taskIndex],
                ...updates,
                updatedAt: new Date()
            };

            MOCK_TASKS[taskIndex] = updatedTask;
            return hydrateTask(updatedTask);
        } catch (e: any) {
            return reply.status(400).send({ error: e.message });
        }
    },

    deleteTask: async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const { id } = req.params;
        const taskIndex = MOCK_TASKS.findIndex(t => t.id === id);
        if (taskIndex === -1) return reply.status(404).send({ error: "Task not found" });

        MOCK_TASKS.splice(taskIndex, 1);
        return true;
    },

    moveTask: async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const { id } = req.params;
        const body = MoveTaskSchema.parse(req.body); // Safe parsing

        const taskIndex = MOCK_TASKS.findIndex(t => t.id === id);
        if (taskIndex === -1) return reply.status(404).send({ error: "Task not found" });

        const updatedTask = {
            ...MOCK_TASKS[taskIndex],
            columnId: body.targetColumnId,
            position: body.newPosition || Date.now(),
            updatedAt: new Date()
        };

        MOCK_TASKS[taskIndex] = updatedTask;
        return hydrateTask(updatedTask);
    }
};
