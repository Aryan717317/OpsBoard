import { KanbanBoard } from "./components/kanban/KanbanBoard";
import { ActivityPanel } from "./components/layout/ActivityPanel";
import { ControlBar } from "./components/layout/ControlBar";
import { MetricsBar } from "./components/layout/MetricsBar";
import { FilterBar } from "./components/layout/FilterBar";
import { CreateTaskModal } from "./components/kanban/CreateTaskModal";
import { LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { useBoardStore } from "./store/useBoardStore";

function App() {
  const fetchTasks = useBoardStore(state => state.fetchTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleOpenCreateTask = (columnId?: string) => {
    setActiveColumnId(columnId);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans">
      {/* Top Header branding (part of design, implicit) */}
      <div className="px-6 py-4 flex items-center gap-2">
        <LayoutGrid className="w-5 h-5 text-text-secondary" />
        <h1 className="text-base font-semibold text-text-primary">OpsBoard</h1>
      </div>

      <div className="flex-1 flex flex-col px-6">
        <MetricsBar />
        <FilterBar />
        <div className="flex items-center justify-between mb-4">
          <ControlBar onOpenCreateTask={() => handleOpenCreateTask()} />
        </div>

        <div className="flex-1 relative">
          <KanbanBoard onOpenCreateTask={handleOpenCreateTask} />
        </div>
      </div>

      <ActivityPanel />
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialColumnId={activeColumnId}
      />
    </div>
  )
}

export default App;
