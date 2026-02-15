const Sidebar = ({ activity }) => (
    <aside className="w-64 border-r border-slate-800 bg-black hidden xl:flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-slate-800 bg-slate-900/10">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">System_Event_Log</span>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activity.map((a, i) => (
                <div key={i} className="border-l border-blue-900/50 pl-4 py-1">
                    <div className="text-slate-600 mono text-[9px] mb-1">{a.time} // SIG</div>
                    <div className="text-slate-400 font-bold text-[10px] uppercase leading-tight tracking-tighter">{a.message}</div>
                </div>
            ))}
        </div>
    </aside>
);
window.Sidebar = Sidebar;
