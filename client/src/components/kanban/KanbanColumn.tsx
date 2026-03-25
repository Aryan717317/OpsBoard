import type { Column, Task } from "../../types";
import { TaskCard } from "./TaskCard";
import { cn } from "../../lib/utils";
import { Plus } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface KanbanColumnProps {
    column: Column;
    tasks: Task[];
    onAddClick?: (columnId: string) => void;
}

function SortableTask({ task }: { task: Task }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard task={task} isDragging={isDragging} />
        </div>
    );
}

export function KanbanColumn({ column, tasks, onAddClick }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: column.id,
    });

    return (
        <div className="flex w-80 min-w-80 flex-col gap-3">
            {/* Column Header */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <div className={cn("h-2.5 w-2.5 rounded-full", (() => {
                        if (column.id === 'Backlog') return 'bg-indigo-500';
                        if (column.id === 'In Progress') return 'bg-blue-500';
                        if (column.id === 'Testing') return 'bg-yellow-500';
                        return 'bg-green-500';
                    })())} />
                    <span className="font-semibold text-text-primary">{column.title}</span>
                    {column.wipLimit && (
                        <span className="text-text-secondary text-xs">({tasks.length}/{column.wipLimit})</span>
                    )}
                </div>
                <button
                    onClick={() => onAddClick?.(column.id)}
                    className="text-text-secondary hover:text-white transition-colors"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Task List (Droppable Area) */}
            <div ref={setNodeRef} className="flex min-h-[500px] flex-col gap-3 rounded-xl bg-transparent">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <SortableTask key={task.id} task={task} />
                    ))}
                </SortableContext>

                {/* Placeholder if empty */}
                {tasks.length === 0 && (
                    <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-muted text-sm text-text-muted">
                        No tasks
                    </div>
                )}

                {column.id === 'Backlog' && (
                    <button
                        onClick={() => onAddClick?.(column.id)}
                        className="mt-2 text-xs text-text-muted cursor-pointer hover:text-text-secondary w-full text-left"
                    >
                        More tasks...
                    </button>
                )}
            </div>
        </div>
    );
}
