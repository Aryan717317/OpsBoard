import { Plus, ChevronDown } from "lucide-react";
import { Button } from "../ui/Button";
interface ControlBarProps {
    onOpenCreateTask: () => void;
}

export function ControlBar({ onOpenCreateTask }: ControlBarProps) {
    return (
        <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button
                    onClick={onOpenCreateTask}
                    className="bg-primary hover:bg-indigo-600 text-white font-medium px-4 py-2 h-10 shadow-lg shadow-indigo-500/20"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Task
                </Button>

                <div className="h-8 w-px bg-[#27272A] mx-2"></div>

                <FilterDropdown label="All Boards" active />
                <FilterDropdown label="My Tasks" />
                <FilterDropdown label="Team" />
                <FilterDropdown label="Priority" />
                <FilterDropdown label="Assignee" />
            </div>
        </div>
    );
}

function FilterDropdown({ label, active }: { label: string, active?: boolean }) {
    return (
        <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors border ${active ? 'bg-[#27272A] border-[#3F3F46] text-white' : 'border-transparent text-text-secondary hover:text-white hover:bg-[#27272A]/50'}`}>
            {label}
            <ChevronDown className="w-3.5 h-3.5 opacity-50" />
        </button>
    )
}
