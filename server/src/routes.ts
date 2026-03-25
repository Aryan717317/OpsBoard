import { FastifyInstance } from "fastify";
import { BoardController } from "./modules/board/board.controller";


export async function appRoutes(server: FastifyInstance) {

    server.get('/api/boards', BoardController.getBoards);
    server.post('/api/boards', BoardController.createBoard);
    server.get('/api/users', BoardController.getUsers);
    server.get('/api/teams', BoardController.getTeams);

    server.post('/api/tasks', async (req, reply) => {
        const result = await BoardController.createTask(req, reply);
        if (result) {
            (server as any).io.emit('task:created', result);
        }
        return result;
    });

    // Task Routes
    server.patch('/api/tasks/:id/move', async (req, reply) => {
        const result = await BoardController.moveTask(req as any, reply);

        // Broadcast to room
        if (result) {
            (server as any).io.emit('task:moved', result);
        }
        return result;
    });

    server.patch('/api/tasks/:id', async (req, reply) => {
        const result = await BoardController.updateTask(req as any, reply);
        if (result) {
            (server as any).io.emit('task:updated', result);
        }
        return result;
    });

    server.delete('/api/tasks/:id', async (req, reply) => {
        const { id } = req.params as { id: string };
        const success = await BoardController.deleteTask(req as any, reply);
        if (success) {
            (server as any).io.emit('task:deleted', id);
        }
        return { success };
    });

    // Seed Route for Demo (Disabled for In-Memory Mode)
    server.post('/api/seed', async (req, reply) => {
        return { message: "Seeding skipped: Running in In-Memory Mode 🚀" };
    });
}
