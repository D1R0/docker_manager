const NewStackModal = ({ isOpen, onClose, onDeploy, newProject, setNewProject }) => {
    return (
        <div className={`modal-backdrop ${isOpen ? 'active' : ''}`}>
            <div className="modal-content max-w-sm">
                <div className="bg-[#09090b] border border-zinc-800 p-16 shadow-2xl relative">
                    <button onClick={onClose} className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-all">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                    <h2 className="text-white text-[12px] font-bold uppercase tracking-[0.6em] mb-12 text-center underline underline-offset-8 decoration-emerald-950">Init_Deployment</h2>
                    <form onSubmit={onDeploy} className="space-y-10">
                        <div className="space-y-2">
                            <label className="text-[10px] mono text-zinc-700 uppercase font-bold tracking-widest">Stack_ID</label>
                            <input required className="w-full bg-zinc-950 p-3 text-sm text-emerald-500 border-b border-zinc-900 focus:border-emerald-500 outline-none uppercase" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})}/>
                        </div>
                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-2"><label className="text-[10px] mono text-zinc-700 uppercase font-bold tracking-widest">Web_Gate</label><input type="number" className="w-full bg-transparent border-b border-zinc-900 p-2 text-sm text-zinc-300 outline-none focus:border-emerald-950" value={newProject.web_port} onChange={e => setNewProject({...newProject, web_port: parseInt(e.target.value)})}/></div>
                            <div className="space-y-2"><label className="text-[10px] mono text-zinc-700 uppercase font-bold tracking-widest">SQL_Gate</label><input type="number" className="w-full bg-transparent border-b border-zinc-900 p-2 text-sm text-zinc-300 outline-none focus:border-emerald-950" value={newProject.sql_port} onChange={e => setNewProject({...newProject, sql_port: parseInt(e.target.value)})}/></div>
                        </div>
                        <button className="w-full bg-white text-black py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all mt-8 shadow-lg">Confirm_Execute</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
window.NewStackModal = NewStackModal;
