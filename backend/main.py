from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import docker
import os
import psutil
import subprocess
import threading
import time
from datetime import datetime
from pathlib import Path
from generator_logic import generate_files

app = FastAPI(title="Fleet OS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = docker.from_env()
# Dynamic paths relative to this file
BASE_DIR = Path(__file__).resolve().parent.parent
BASE_PROJECTS_DIR = BASE_DIR / "projects"
DEV_DIR = BASE_DIR.parent

containers_cache = []
activity_feed = []
system_stats_cache = {"cpu": 0, "ram": 0, "disk": 0, "containers_running": 0}

def add_activity(msg):
    global activity_feed
    now = datetime.now().strftime("%H:%M:%S")
    activity_feed.insert(0, {"time": now, "message": msg})
    activity_feed = activity_feed[:15]

def background_worker():
    global containers_cache, system_stats_cache
    while True:
        try:
            system_stats_cache = {
                "cpu": psutil.cpu_percent(interval=None),
                "ram": psutil.virtual_memory().percent,
                "disk": psutil.disk_usage('/').percent,
                "containers_running": len(client.containers.list(filters={"status": "running"}))
            }

            raw_data = client.api.containers(all=True)
            new_list = []
            
            for c in raw_data:
                state = c.get('State', 'unknown').lower()
                status_str = c.get('Status', 'unknown') 
                names = c.get('Names', ['/unknown'])
                name = names[0].replace('/', '')
                
                # Command & Created info
                command = c.get('Command', 'N/A')
                # Docker API returns Status like "Exited (0) 5 days ago" or "Up 2 hours"
                
                labels = c.get('Labels', {})
                project = labels.get('com.docker.compose.project')
                if not project:
                    if '_' in name:
                        parts = name.split('_')
                        if parts[0] in ['php', 'mysql', 'phpmyadmin', 'db', 'web']: project = '_'.join(parts[1:])
                        else: project = parts[0]
                    else: project = 'Standalone'

                net_info = [{"name": n, "ip": d.get('IPAddress', 'N/A')} for n, d in c.get('NetworkSettings', {}).get('Networks', {}).items()]
                ports_info = [{"container": p.get('PrivatePort'), "host": p.get('PublicPort')} for p in c.get('Ports', [])]
                
                new_list.append({
                    "id": c.get('Id')[:12],
                    "name": name,
                    "project": project,
                    "service": labels.get('com.docker.compose.service', name),
                    "status": state,
                    "status_human": status_str,
                    "command": command,
                    "image": c.get('Image', 'untagged'),
                    "networks": net_info,
                    "ports": ports_info
                })
            containers_cache = new_list
        except Exception as e: print(f"Worker Error: {e}")
        time.sleep(2)

threading.Thread(target=background_worker, daemon=True).start()

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_index(): return FileResponse("static/index.html")

@app.get("/activity")
def get_activity(): return activity_feed

@app.get("/system-stats")
def get_stats(): return system_stats_cache

@app.get("/containers")
def list_containers(): return containers_cache

@app.post("/project-control/{project_name}/{action}")
def control_project(project_name: str, action: str):
    try:
        all_c = client.containers.list(all=True)
        to_act = [c for c in all_c if project_name != 'Standalone' and (project_name in c.name or c.attrs.get('Config', {}).get('Labels', {}).get('com.docker.compose.project') == project_name)]
        for c in to_act:
            if action == "start": c.start()
            elif action == "stop": c.stop()
            elif action == "remove": c.remove(force=True)
        add_activity(f"SEQUENCE_{action.upper()}: {project_name}")
        return {"message": "OK"}
    except Exception as e: return JSONResponse(status_code=400, content={"detail": str(e)})

@app.get("/project-logs/{project_name}")
def get_project_logs(project_name: str):
    locations = [BASE_PROJECTS_DIR / project_name, DEV_DIR / project_name]
    for loc in locations:
        log_path = loc / "deployment.log"
        if log_path.exists():
            with open(log_path, "r") as f: return {"logs": f.read()}
    return {"logs": "Null."}

@app.get("/logs/{container_name}")
def get_logs(container_name: str):
    try:
        result = subprocess.run(["docker", "logs", "--tail", "100", container_name], capture_output=True, text=True)
        return {"logs": result.stdout + result.stderr}
    except Exception as e: return {"logs": str(e)}

@app.post("/control/{container_name}/{action}")
def control_container(container_name: str, action: str):
    try:
        container = client.containers.get(container_name)
        if action == "start": container.start()
        elif action == "stop": container.stop()
        elif action == "remove": container.remove(force=True)
        add_activity(f"SIGNAL_{action.upper()}: {container_name}")
        return {"message": "OK"}
    except Exception as e: return JSONResponse(status_code=400, content={"detail": str(e)})

@app.post("/create-project")
def create_project(project: ProjectCreate):
    try:
        path = generate_files(project.name.lower(), str(project.web_port), str(project.sql_port), str(project.debug_port), BASE_PROJECTS_DIR)
        log_file_path = Path(path) / "deployment.log"
        log_file = open(log_file_path, "w")
        subprocess.Popen(["docker", "compose", "up", "-d"], cwd=path, stdout=log_file, stderr=log_file)
        add_activity(f"INIT_STACK: {project.name}")
        return {"message": "Success"}
    except Exception as e: return JSONResponse(status_code=500, content={"detail": str(e)})

class ProjectCreate(BaseModel):
    name: str
    web_port: int = 8080
    sql_port: int = 3306
    debug_port: int = 9003

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8888)
