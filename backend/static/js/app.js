const { useState, useEffect, useMemo } = React;

function App() {
    const [containers, setContainers] = useState([]);
    const [stats, setStats] = useState({ cpu: 0, ram: 0, disk: 0 });
    const [activity, setActivity] = useState([]);
    const [activeLog, setActiveLog] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); 
    const [processMsg, setProcessMsg] = useState('');
    const [toast, setToast] = useState(null);
    const [newProject, setNewProject] = useState({ name: '', web_port: 8080, sql_port: 3306 });

    const fetchData = async () => {
        try {
            const [cRes, sRes, aRes] = await Promise.all([ fetch('/containers'), fetch('/system-stats'), fetch('/activity') ]);
            if (cRes.ok) setContainers(await cRes.json());
            if (sRes.ok) setStats(await sRes.json());
            if (aRes.ok) setActivity(await aRes.json());
        } catch (e) { console.error(e); }
    };

    const showNotify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    useEffect(() => { window.showNotify = showNotify; }, []);

    const runAction = async (url, msg) => {
        setProcessMsg(msg);
        setIsProcessing(true);
        try {
            await fetch(url, { method: 'POST' });
            setTimeout(() => {
                setIsProcessing(false);
                fetchData();
                showNotify("COMPLETE");
            }, 1800);
        } catch (e) {
            setTimeout(() => setIsProcessing(false), 500);
            showNotify("ERROR");
        }
    };

    const projectEntries = useMemo(() => {
        const grouped = containers.reduce((acc, c) => {
            const pName = String(c.project || 'Standalone');
            if (!acc[pName]) acc[pName] = [];
            acc[pName].push(c);
            return acc;
        }, {});
        return Object.entries(grouped).sort(([a],[b]) => a === 'Standalone' ? 1 : b === 'Standalone' ? -1 : a.localeCompare(b));
    }, [containers]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            {toast && <div className="toast-notify rounded-sm">{toast}</div>}
            
            <window.LoadingOverlay isVisible={isProcessing} stackName={processMsg} />

            <window.Sidebar activity={activity} />

            <div className="flex-1 flex flex-col min-w-0">
                <window.Navbar stats={stats} onNewStack={() => setShowModal(true)} />

                <div className="flex-1 overflow-y-auto p-8 bg-[#050505] compact-scroll">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projectEntries.map(([name, stack], idx) => {
                            const runningCount = stack.filter(c => c.status === 'running').length;
                            const isAllRunning = runningCount === stack.length && stack.length > 0;

                            return (
                                <div key={name} style={{animationDelay: `${idx * 0.08}s`}} className={`project-card p-8 flex flex-col min-h-[380px] rounded-sm ${isAllRunning ? 'card-on' : 'card-off'}`}>
                                    <div className="flex justify-between items-start mb-8 border-b border-zinc-900/50 pb-6">
                                        <div>
                                            <h3 className={`text-[16px] font-bold tracking-tight uppercase ${isAllRunning ? 'text-emerald-500' : 'text-amber-500'}`}>{name}</h3>
                                            <p className="text-[10px] mono text-zinc-700 mt-1 uppercase tracking-widest">{runningCount} / {stack.length} ONLINE</p>
                                        </div>
                                        <button onClick={() => runAction(`/project-control/${name}/${runningCount > 0 ? 'stop' : 'start'}`, `${runningCount > 0 ? 'Halting' : 'Starting'} ${name}`)} 
                                                className={`text-[10px] font-bold uppercase border px-4 py-1.5 transition-all btn-control ${isAllRunning ? 'border-zinc-800 text-zinc-600 btn-halt-hover' : 'border-emerald-900 text-emerald-500 hover:bg-emerald-500 hover:text-white btn-init-hover'}`}>
                                            {runningCount > 0 ? 'HALT' : 'INIT'}
                                        </button>
                                    </div>

                                    <div className="flex-1">
                                        {stack.map(c => <window.ServiceRow key={c.id} service={c} onLog={(type, name) => setActiveLog({type, name})} />)}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-zinc-900 flex justify-between items-center">
                                        <button onClick={() => setActiveLog({type:'build', name})} className="text-[10px] font-bold text-zinc-700 hover:text-white uppercase tracking-[0.2em]">Build_Log</button>
                                        <button onClick={() => runAction(`/project-control/${name}/remove`, `Purging ${name}`)} className="text-[10px] font-bold text-zinc-800 hover:text-rose-600 uppercase transition-all">Purge</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modals are now always in DOM to allow exit animations */}
            <window.LogModal activeLog={activeLog} onClose={() => setActiveLog(null)} />

            <window.NewStackModal 
                isOpen={showModal} 
                onClose={() => setShowModal(false)}
                newProject={newProject}
                setNewProject={setNewProject}
                onDeploy={(e) => {
                    e.preventDefault();
                    setShowModal(false);
                    runAction('/create-project', `Initializing ${newProject.name}`);
                }}
            />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
