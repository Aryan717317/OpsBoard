import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useBoardStore } from '../../store/useBoardStore';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialColumnId?: string;
}

export function CreateTaskModal({ isOpen, onClose, initialColumnId }: CreateTaskModalProps) {
    const createTask = useBoardStore(state => state.createTask);
    const columns = useBoardStore(state => state.columns);
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
    const [columnId, setColumnId] = useState(initialColumnId || columns[0]?.id || 'backlog');
    const [teamName, setTeamName] = useState('');
    const [assigneeName, setAssigneeName] = useState('');

    // Update columnId if columns load later or initialColumnId changes
    useEffect(() => {
        if (initialColumnId) {
            setColumnId(initialColumnId);
        } else if (columns.length > 0 && !columns.find(c => c.id === columnId)) {
            setColumnId(columns[0].id);
        }
    }, [columns, initialColumnId, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createTask({
            title,
            priority,
            columnId,
            teamId: teamName || undefined,
            assigneeIds: assigneeName ? [assigneeName] : []
        });
        setTitle('');
        setTeamName('');
        setAssigneeName('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-[#18181B] border border-[#27272A] p-6 rounded-xl w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">Create New Task</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Task Title</label>
                        <input
                            type="text"
                            className="w-full bg-[#0F1115] border border-[#27272A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                            placeholder="Enter task title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
                            <select
                                className="w-full bg-[#0F1115] border border-[#27272A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as any)}
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Column</label>
                            <select
                                className="w-full bg-[#0F1115] border border-[#27272A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                value={columnId}
                                onChange={(e) => setColumnId(e.target.value)}
                            >
                                {columns.map(col => (
                                    <option key={col.id} value={col.id}>{col.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Team</label>
                            <input
                                type="text"
                                className="w-full bg-[#0F1115] border border-[#27272A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                                placeholder="Team Name"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Assignee</label>
                            <input
                                type="text"
                                className="w-full bg-[#0F1115] border border-[#27272A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                                placeholder="Assignee Name"
                                value={assigneeName}
                                onChange={(e) => setAssigneeName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3 justify-end">
                        <Button type="button" onClick={onClose} className="bg-transparent border border-[#27272A] hover:bg-[#27272A] text-gray-300">
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-primary hover:bg-indigo-600 text-white">
                            Create Task
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
