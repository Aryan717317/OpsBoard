# OpsBoard: Kanban Mission Control 🚀

OpsBoard is a modern, real-time Kanban board application designed for high-performance teams. It features a sleek dark-mode interface, real-time synchronization, and flexible task management.

![OpsBoard Preview](https://api.dicebear.com/7.x/identicon/svg?seed=OpsBoard)

## ✨ Features

- **Real-Time Collaboration**: Instant synchronization across all clients using Socket.io.
- **Dynamic Assignments**: Manually enter team and assignee names—no rigid dropdowns.
- **Multi-Board Support**: Separate boards for different departments (e.g., OpsBoard, Engineering).
- **Flexible Kanban**: Drag-and-drop tasks between columns (Backlog, In Progress, Testing, Done).
- **Advanced Filtering**: Filter by Board, Team, or Assignee to focus on what matters.
- **Priority Management**: Toggle task priority (High, Medium, Low) with a single click.
- **Premium UI**: Modern dark-mode aesthetic with smooth animations and responsive layouts.

## 🛠️ Tech Stack

### Frontend
- **React** with **Vite**
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Lucide React** for iconography
- **Socket.io-client** for real-time events

### Backend
- **Node.js** with **Fastify**
- **Zod** for schema validation
- **Socket.io** for real-time broadcasting
- **TSX** for development hot-reloading

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aryan717317/OpsBoard.git
   cd OpsBoard
   ```

2. **Setup the Backend**:
   ```bash
   cd server
   npm install
   npm run dev
   ```
   The backend will start on `http://localhost:3000`.

3. **Setup the Frontend**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`.

## 📝 Roadmap

- [x] In-memory prototype with full Kanban features.
- [x] Dynamic team/assignee assignments.
- [x] Real-time synchronization.
- [ ] Supabase/PostgreSQL integration for persistent storage.
- [ ] User authentication and roles.
- [ ] Analytics dashboard for team velocity.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
