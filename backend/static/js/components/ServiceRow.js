const { useState } = React;

const ServiceRow = ({ service, onLog }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isRunning = service.status === 'running';

    const copyBash = (e) => {
        e.stopPropagation();
        const cmd = `docker exec -it ${service.name} bash`;
        navigator.clipboard.writeText(cmd);
        if (window.showNotify) window.showNotify("CMD_COPIED");
    };

    return (
        <div className="border-b border-zinc-900/20">
            <div 
                className="flex justify-between items-center cursor-pointer hover:bg-white/[0.01] py-3 px-2 transition-all"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center space-x-4">
                    <i className={`fas fa-chevron-right text-[8px] text-zinc-800 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-[#6366f1]' : ''}`}></i>
                    <span className={`text-[13px] font-bold uppercase tracking-tight ${isRunning ? 'text-zinc-200' : 'text-zinc-600'}`}>{service.service}</span>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`text-[9px] mono font-bold uppercase ${isRunning ? 'text-emerald-500' : 'text-rose-500'}`}>{service.status}</span>
                    {isRunning && <div className="w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_5px_#10b981]"></div>}
                </div>
            </div>
            
            <div className={`detail-panel ${isExpanded ? 'expanded' : ''} px-6`}>
                <div className="grid grid-cols-2 gap-6 bg-black/40 p-5 border-l-2 border-zinc-800">
                    <div>
                        <span className="text-[9px] text-zinc-700 font-bold uppercase block mb-1">NETWORK_IP</span>
                        <span className="mono text-[11px] text-zinc-400 font-bold">{service.networks[0]?.ip || 'INTERNAL'}</span>
                    </div>
                    <div>
                        <span className="text-[9px] text-zinc-700 font-bold uppercase block mb-1">GATE_PORTS</span>
                        <div className="flex flex-wrap gap-1.5">
                            {service.ports.map((p, i) => <span key={i} className={`port-tag ${p.host ? 'port-active' : ''}`}>{p.host || p.container}</span>)}
                        </div>
                    </div>
                    <div className="col-span-2 pt-4 border-t border-zinc-900/50 flex justify-between items-center">
                        <span className="text-[9px] mono text-zinc-800 uppercase tracking-widest">ID: {service.id}</span>
                        <div className="flex space-x-4">
                            <button onClick={(e) => { e.stopPropagation(); onLog('runtime', service.name); }} className="text-[10px] font-bold text-zinc-600 hover:text-emerald-500 uppercase">Logs</button>
                            <button onClick={copyBash} className="text-[10px] font-bold text-zinc-600 hover:text-white uppercase">SH</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
window.ServiceRow = ServiceRow;
