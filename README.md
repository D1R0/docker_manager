# 🐳 Fleet OS // Docker Stack Manager v6.7

A high-performance, minimalist dashboard for managing Docker container stacks. Designed with a **Cyber-Industrial** aesthetic, Fleet OS provides real-time monitoring, stack scaffolding, and shell access directly from your browser.

---

## ⚡ Key Features

- **Project-Centric Grouping:** Intelligent grouping of containers into "Stacks" (e.g., PHP + MySQL + PMA).
- **HUD Interface:** Real-time system monitoring (CPU, RAM, Disk) and cascading entrance animations.
- **Deep Inspection:** Automatic IP detection across multiple networks and visible port mapping.
- **Vocal Logic:** Toast notifications for actions and a dedicated "System Failure" modal for Docker errors.
- **Multi-Shell Access:** Quick copy-paste commands for `bash` entry into any container within a stack.
- **Live Logs:** Auto-polling runtime logs with a "Matrix-style" typing effect.
- **Stack Scaffolding:** One-click deployment of PHP 8.2 + MySQL stacks with automatic Docker Compose orchestration.

---

## 🏗️ Technical Architecture

### Backend
- **Python 3 (FastAPI)**: High-speed API core.
- **Docker SDK**: Native interaction with the Docker engine.
- **Background Worker**: Multi-threaded stats collector for near-zero latency.
- **Isolated Environment**: Runs completely within a `venv` to keep your system clean.

### Frontend
- **React (Modular)**: Component-based architecture (Sidebar, Navbar, ServiceRow, Modals).
- **SASS (SCSS)**: Professional style management with variables and partials.
- **Tailwind CSS**: Utility-first styling for precise HUD elements.
- **Smooth UX**: Custom Cubic-Bezier animations and glassmorphism.

---

## 🚀 Installation & Setup

### 1. Prerequisites
- Docker & Docker Compose
- Python 3.10+
- Node.js (only for SCSS development)

### 2. Manual Start
```bash
cd backend
source venv/bin/activate
python3 main.py
```
*The dashboard will be accessible at `http://localhost:8888`.*

### 3. Autostart (Systemd)
The manager includes a systemd user service for automatic startup on boot:
```bash
# Enable and Start
systemctl --user enable docker-manager.service
systemctl --user start docker-manager.service

# Check Logs
journalctl --user -u docker-manager.service -f
```

---

## 🎨 Design System (SASS)
Styles are managed in `backend/static/css/scss/`.
- `_variables.scss`: Color tokens (Emerald, Gold, Lava).
- `_animations.scss`: Custom entrance and HUD effects.
- `_components.scss`: Modular UI elements.

To compile changes:
```bash
cd backend/static/css
npm run watch
```

---

## 📁 Project Structure
```text
docker_manager/
├── backend/
│   ├── main.py             # API Entry Point
│   ├── generator_logic.py  # Scaffolding Engine
│   ├── static/             # Frontend Assets
│   │   ├── css/            # Compiled CSS & SCSS Sources
│   │   ├── js/             # Modular React Components
│   │   └── index.html      # Main Structure
│   └── venv/               # Isolated Python Environment
├── projects/               # Generated User Stacks
└── README.md               # Documentation
```

---
*Built for precision engineers and developers who live in the terminal.*
