const { useEffect, useState } = React;

const LogModal = ({ activeLog, onClose }) => {
    const [content, setContent] = useState('INITIALIZING_STREAM...');
    const [isPolling, setIsPolling] = useState(false);

    const fetchLogs = async () => {
        if (!activeLog) return;
        try {
            const endpoint = activeLog.type === 'build' ? `/project-logs/${activeLog.name}` : `/logs/${activeLog.name}`;
            const res = await fetch(endpoint);
            const data = await res.json();
            setContent(data.logs || 'No data stream.');
        } catch (e) { setContent('Error connecting to log stream.'); }
    };

    useEffect(() => {
        if (activeLog) {
            fetchLogs();
            setIsPolling(true);
            const interval = setInterval(fetchLogs, 3000);
            return () => { clearInterval(interval); setIsPolling(false); };
        }
    }, [activeLog]);

    return (
        <div className={`modal-backdrop ${activeLog ? 'active' : ''}`}>
            <div className="modal-content max-w-5xl">
                <div className="bg-black border border-zinc-800 flex flex-col shadow-2xl h-[85vh]">
                    <div className="p-8 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/50">
                        <div className="flex flex-col">
                            <div className="flex items-center space-x-3">
                                <span className="text-[14px] font-bold mono uppercase text-emerald-500 tracking-[0.3em]">{activeLog?.type || 'CORE'}_CAPTURE</span>
                                {isPolling && (
                                    <div className="flex items-center space-x-2 bg-emerald-950/30 px-2 py-0.5 border border-emerald-900/50">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                        <span className="text-[8px] font-bold text-emerald-500 mono">LIVE</span>
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px] text-zinc-600 mono mt-1 uppercase">SOURCE: {activeLog?.name}</span>
                        </div>
                        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-all"><i className="fas fa-times text-2xl"></i></button>
                    </div>
                    <div className="flex-1 overflow-auto p-10 mono text-[13px] leading-loose text-zinc-400 bg-black/40">
                        <pre className="whitespace-pre-wrap">{content}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};
window.LogModal = LogModal;
