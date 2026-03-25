import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core';
import { useBoardStore } from '../../store/useBoardStore';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { useState } from 'react';
import type { Task } from '../../types';

export function KanbanBoard({ onOpenCreateTask }: { onOpenCreateTask?: (columnId?: string) => void }) {
    const { columns, tasks, moveTask } = useBoardStore();
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const task = tasks.find(t => t.id === active.id);
        if (task) setActiveTask(task);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) {
            setActiveTask(null);
            return;
        }

        const taskId = active.id as string;
        const overId = over.id as string;

        // Check if over is a column
        const isOverColumn = columns.some(c => c.id === overId);

        // Simplistic Logic: If dropped on a column, move to it. 
        // If dropped on another task, find that task's column.

        let targetColumnId = '';

        if (isOverColumn) {
            targetColumnId = overId;
        } else {
            // Dropped on a task?
            const overTask = tasks.find(t => t.id === overId);
            if (overTask) {
                targetColumnId = overTask.columnId;
            }
        }

        if (targetColumnId && targetColumnId !== activeTask?.columnId) {
            moveTask(taskId, targetColumnId);
        }

        setActiveTask(null);
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-full flex-1 gap-6 overflow-x-auto pb-4">
                {columns.map(col => (
                    <KanbanColumn
                        key={col.id}
                        column={col}
                        tasks={tasks.filter(t => t.columnId === col.id)}
                        onAddClick={onOpenCreateTask}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
            </DragOverlay>
        </DndContext>
    );
}
