import type { Task } from "../../types";
import { cn } from "../../lib/utils";
import { Clock, AlertCircle, CheckCircle, Trash2 } from "lucide-react";
import { useBoardStore } from "../../store/useBoardStore";

interface TaskCardProps {
    task: Task;
    isDragging?: boolean;
}

export function TaskCard({ task, isDragging }: TaskCardProps) {
    const deleteTask = useBoardStore(state => state.deleteTask);

    return (
        <div className={cn(
            "group relative flex flex-col gap-3 rounded-xl bg-[#18181B] p-4 text-left shadow-sm transition-all hover:ring-1 hover:ring-primary/50",
            isDragging && "rotate-2 scale-105 shadow-xl ring-1 ring-primary z-50 cursor-grabbing"
        )}>
            {/* Header: Dot + Title + Delete */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                    <div className={cn("mt-1.5 h-2 w-2 rounded-full",
                        task.columnId.toLowerCase() === 'backlog' ? "bg-indigo-500" :
                            task.columnId.toLowerCase() === 'inprogress' ? "bg-amber-400" :
                                task.columnId.toLowerCase() === 'testing' ? "bg-purple-500" :
                                    "bg-green-500"
                    )} />
                    <span className="text-sm font-medium text-text-primary leading-tight">
                        {task.title}
                    </span>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this task?')) {
                            deleteTask(task.id);
                        }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-danger/20 hover:text-danger rounded transition-all text-text-muted"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Meta Row 1: Users, Priority/Status Text */}
            <div className="flex flex-col gap-2">

                {/* Example: "Alex & Mia" or "High Priority" */}
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            const nextPriority = task.priority === 'High' ? 'Medium' : task.priority === 'Medium' ? 'Low' : 'High';
                            useBoardStore.getState().updateTask(task.id, { priority: nextPriority });
                        }}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        {task.priority === 'High' && (
                            <div className="flex items-center gap-1.5 text-danger bg-danger/10 px-2 py-1 rounded">
                                <AlertCircle className="w-3 h-3" />
                                <span className="font-medium">High</span>
                            </div>
                        )}
                        {task.priority === 'Medium' && (
                            <div className="flex items-center gap-1.5 text-warning bg-warning/10 px-2 py-1 rounded text-yellow-500 bg-yellow-500/10">
                                <span className="font-medium">Medium</span>
                            </div>
                        )}
                        {task.priority === 'Low' && (
                            <div className="flex items-center gap-1.5 text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                                <span className="font-medium">Low</span>
                            </div>
                        )}
                    </div>

                    {((task.assignees && task.assignees.length > 0) || (task.assigneeIds && task.assigneeIds.length > 0)) && (
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {(task.assignees && task.assignees.length > 0
                                    ? task.assignees
                                    : (task.assigneeIds || []).map(id => ({ id, name: id }))).map(user => (
                                        <img key={user.id} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="h-5 w-5 rounded-full border border-[#18181B] bg-muted" />
                                    ))}
                            </div>
                            <span className="text-muted-foreground">
                                {(task.assignees && task.assignees.length > 0
                                    ? task.assignees
                                    : (task.assigneeIds || []).map(id => ({ id, name: id }))).map(u => u.name).join(' & ')}
                            </span>
                        </div>
                    )}

                    {task.dueDate && (
                        <div className={cn("flex items-center gap-1.5",
                            task.dueDate.includes('Tomorrow') ? "text-danger" : "text-success"
                        )}>
                            {task.dueDate.includes('Tomorrow') ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                            <span>{task.dueDate}</span>
                        </div>
                    )}
                </div>

            </div>

            {/* Footer: Tags / Comments / ID */}
            <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                    {task.tags?.includes('Testing') && (
                        <div className="flex items-center gap-1 text-xs text-text-secondary">
                            <span className="w-3 h-3 bg-white/20 rounded flex items-center justify-center">✓</span>
                            Testing
                        </div>
                    )}
                </div>

                {/* ID on right if exists */}
                <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] uppercase tracking-tighter text-primary/70 font-bold bg-primary/5 px-1.5 py-0.5 rounded">
                        {(task.boardId === 'board-1' || !task.boardId) ? 'OpsBoard' : 'Engineering'}
                    </span>
                    {task.id.startsWith('#') || !isNaN(Number(task.id)) ? (
                        <span className="text-xs text-text-muted font-mono">{task.id}</span>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
