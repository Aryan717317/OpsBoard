import { useState, useEffect } from "react";
import { useBoardStore } from "../../store/useBoardStore";
import { Users, User as UserIcon, LayoutGrid, Filter } from "lucide-react";
import { cn } from "../../lib/utils";
import { API_URL } from "../../lib/socket";

export function FilterBar() {
    const { filters, setFilters } = useBoardStore();
    const [users, setUsers] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [boards, setBoards] = useState<any[]>([]);

    useEffect(() => {
        // Fetch users, teams, and boards for filter dropdowns
        const fetchData = async () => {
            try {
                const [uRes, tRes, bRes] = await Promise.all([
                    fetch(`${API_URL}/api/users`),
                    fetch(`${API_URL}/api/teams`),
                    fetch(`${API_URL}/api/boards`)
                ]);
                setUsers(await uRes.json());
                setTeams(await tRes.json());
                setBoards(await bRes.json());
            } catch (e) {
                console.error("FilterBar Data Fetch Error", e);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex items-center gap-4 py-3 px-6 border-b border-white/5 bg-background overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 text-text-secondary mr-2">
                <Filter className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
            </div>

            {/* Board Selector */}
            <div className="flex items-center gap-2 whitespace-nowrap">
                <LayoutGrid className="w-4 h-4 text-text-muted" />
                <select
                    className="bg-[#18181B] text-xs text-text-primary border-none rounded px-2 py-1 outline-none ring-1 ring-white/10 focus:ring-primary/50"
                    value={filters.boardId || ""}
                    onChange={(e) => setFilters({ boardId: e.target.value || undefined })}
                >
                    <option value="">All Boards</option>
                    {boards.map(b => (
                        <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                </select>
            </div>

            {/* Quick Toggle: My Tasks */}
            <button
                onClick={() => setFilters({ userId: filters.userId === "Alex" ? undefined : "Alex" })}
                className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded text-xs transition-all",
                    filters.userId === "Alex"
                        ? "bg-primary/20 text-primary ring-1 ring-primary/50"
                        : "bg-[#18181B] text-text-secondary hover:text-text-primary ring-1 ring-white/10"
                )}
            >
                <UserIcon className="w-3.5 h-3.5" />
                My Tasks
            </button>

            <div className="h-4 w-px bg-white/10 mx-1" />

            {/* Team Selector */}
            <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-text-muted" />
                <select
                    className="bg-[#18181B] text-xs text-text-primary border-none rounded px-2 py-1 outline-none ring-1 ring-white/10 focus:ring-primary/50"
                    value={filters.teamId || ""}
                    onChange={(e) => setFilters({ teamId: e.target.value || undefined })}
                >
                    <option value="">Team: All</option>
                    {teams.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
            </div>

            {/* Assignee Selector */}
            <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-text-muted" />
                <select
                    className="bg-[#18181B] text-xs text-text-primary border-none rounded px-2 py-1 outline-none ring-1 ring-white/10 focus:ring-primary/50"
                    value={filters.userId !== "u1" ? filters.userId || "" : ""}
                    onChange={(e) => setFilters({ userId: e.target.value || undefined })}
                >
                    <option value="">Assignee: Any</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                </select>
            </div>

            {/* Clear Filters */}
            {(filters.userId || filters.teamId || filters.boardId) && (
                <button
                    onClick={() => setFilters({ userId: undefined, teamId: undefined, boardId: undefined })}
                    className="text-[10px] text-text-muted hover:text-danger uppercase tracking-widest font-bold ml-auto"
                >
                    Reset
                </button>
            )}
        </div>
    );
}
