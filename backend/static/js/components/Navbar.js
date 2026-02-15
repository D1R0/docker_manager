const Navbar = ({ stats, onNewStack }) => (
    <nav className="h-16 border-b border-zinc-900 flex items-center px-8 justify-between bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-12">
            <h1 className="text-white font-bold text-[11px] tracking-[0.4em] uppercase">Fleet_OS_v6.7</h1>
            <div className="flex space-x-8 text-[10px] mono text-zinc-600 font-bold uppercase">
                <span>CPU <span className="text-emerald-500">{stats.cpu}%</span></span>
                <span>RAM <span className="text-emerald-500">{stats.ram}%</span></span>
            </div>
        </div>
        <button onClick={onNewStack} className="bg-indigo-600 text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500 transition-all rounded-sm shadow-lg shadow-indigo-900/20">
            + NEW_STACK
        </button>
    </nav>
);
window.Navbar = Navbar;
