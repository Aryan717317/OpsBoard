export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'backlog' | 'inprogress' | 'testing' | 'done' | string;

export interface User {
    id: string;
    name: string;
    avatarUrl?: string; // For UI matching, initials or placeholder
}

export interface Task {
    id: string;
    columnId: Status;
    title: string;
    description?: string;
    priority?: Priority;
    assignees?: User[];
    dueDate?: string; // "Due Tomorrow"
    tags?: string[];
    meta?: {
        commentCount?: number;
        subtaskCount?: number;
        subtaskCompleted?: number;
    };
    isLocked?: boolean;
    boardId?: string;
    teamId?: string;
    assigneeIds?: string[];
}

export interface Column {
    id: Status;
    title: string;
    color: string; // Dot color
    wipLimit?: number;
}
