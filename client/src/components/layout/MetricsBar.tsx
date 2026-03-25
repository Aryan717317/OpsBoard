import { Users, BarChart2 } from "lucide-react";
import { useBoardStore } from "../../store/useBoardStore";

export function MetricsBar() {
    const tasks = useBoardStore(state => state.tasks);
    const columns = useBoardStore(state => state.columns);

    const totalTasks = tasks.length;

    // Safety check for case-insensitive matching or exact ID matching
    // Assuming backend uses 'inprogress' but UI might show 'In Progress'
    // Based on previous file reads, IDs are 'backlog', 'inprogress', 'testing', 'done'
    const inProgressTasks = tasks.filter(t => t.columnId === 'inprogress').length;
    const completedTasks = tasks.filter(t => t.columnId === 'done').length;

    // Find WIP limit for 'inprogress' column
    const inProgressColumn = columns.find(c => c.id === 'inprogress');
    const wipLimit = inProgressColumn?.wipLimit || 5;

    return (
        <div className="flex h-16 items-center border-b border-[#27272A] px-1 bg-[#18181B] sticky top-0 z-10 w-full mb-6 rounded-xl">
            <div className="flex w-full items-center justify-between px-4">

                <div className="flex items-center gap-8">
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">{totalTasks}</span>
                        <span className="text-sm text-text-secondary">Total</span>
                    </div>

                    <div className="h-8 w-px bg-[#27272A]"></div>

                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">{inProgressTasks}</span>
                        <span className="text-sm text-text-secondary">In Progress</span>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">{completedTasks}</span>
                        <span className="text-sm text-text-secondary">Completed</span>
                    </div>

                    <div className="ml-8 flex items-center gap-2">
                        <span className="text-lg font-bold text-text-primary">WIP Limit:</span>
                        <span className={`text-sm ${inProgressTasks > wipLimit ? 'text-danger' : 'text-text-secondary'}`}>
                            {inProgressTasks} / {wipLimit}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-primary">
                        <Users className="w-5 h-5" />
                        <div className="flex flex-col leading-none">
                            <span className="text-[10px] text-text-secondary uppercase tracking-wider">Real-Time</span>
                            <span className="text-sm font-medium">Online: 1</span>
                        </div>
                    </div>

                    {/* Placeholder for now */}
                    <span className="text-sm text-text-secondary">Avg: 2d</span>

                    <button className="flex items-center gap-2 rounded-lg border border-[#27272A] bg-[#27272A]/50 px-3 py-1.5 text-sm text-text-primary hover:bg-[#27272A]">
                        <BarChart2 className="w-4 h-4" />
                        Analytics
                    </button>
                </div>

            </div>
        </div>
    );
}
