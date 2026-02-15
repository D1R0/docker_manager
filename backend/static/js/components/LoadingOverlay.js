const LoadingOverlay = ({ isVisible, stackName }) => {
    return (
        <div className={`loading-overlay ${isVisible ? 'active' : ''}`}>
            <div className="scan-line-loader opacity-20"></div>
            
            <div className="relative">
                <div className="spinner-hud"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fab fa-docker text-blue-500 text-4xl animate-pulse"></i>
                </div>
            </div>

            <div className="mt-12 text-center space-y-4">
                <h2 className="text-white text-xs font-black uppercase tracking-[0.8em] animate-pulse">
                    Initiating_Deployment
                </h2>
                <div className="mono text-blue-500 text-[10px] uppercase tracking-widest font-bold">
                    Target_ID: <span className="text-white">[{stackName || "SYS_CLUSTER"}]</span>
                </div>
                
                <div className="flex flex-col space-y-1 pt-8 opacity-40">
                    <p className="mono text-[8px] uppercase tracking-tighter animate-pulse">Syncing_Docker_Daemon... OK</p>
                    <p className="mono text-[8px] uppercase tracking-tighter animate-pulse text-emerald-400" style={{animationDelay: '0.5s'}}>Executing_Sequence... RUNNING</p>
                </div>
            </div>

            <div className="absolute bottom-12 left-12 border-l border-blue-900/30 pl-4">
                <span className="text-[8px] mono text-zinc-800 block uppercase">Fleet_Core // Secure_Link</span>
                <span className="text-[10px] mono text-zinc-600 block tracking-widest font-bold">PROTOCOL: 0x8888</span>
            </div>
        </div>
    );
};
window.LoadingOverlay = LoadingOverlay;
