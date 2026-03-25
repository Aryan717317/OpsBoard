import { BarChart3 } from "lucide-react";

export function ActivityPanel() {
    return (
        <div className="fixed bottom-0 left-0 right-0 border-t border-[#27272A] bg-[#0F1115] px-6 py-2 pb-6 z-20">
            <div className="flex items-center gap-4 text-sm font-medium text-text-secondary mb-3">
                <span className="flex items-center gap-2 text-white border-b-2 border-primary pb-1">
                    <BarChart3 className="w-4 h-4" /> Activity Log
                </span>
                <span className="hover:text-white cursor-pointer pb-1">Insights</span>
            </div>

            <div className="flex flex-col gap-2">
                {/* <LogItem icon={MessageSquare} text={<>Mia moved "Bug Fix #2042" to <span className="text-white">Testing</span></>} /> */}
                <span className="text-gray-500 text-xs">No recent activity.</span>
            </div>
        </div>
    );
}


