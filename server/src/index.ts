import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyIO from 'fastify-socket.io';
import 'dotenv/config';

const PORT = parseInt(process.env.PORT || '3000', 10);

const server = Fastify({ logger: true });

// Register Plugins
server.register(cors, {
    origin: "*" // simplistic for MVP
});
server.register(fastifyIO, {
    cors: {
        origin: "*",
    }
});

// Health Check
server.get('/health', async (request, reply) => {
    return { status: 'ok' };
});

server.get('/', async (request, reply) => {
    return { message: "OpsBoard Backend is Running 🚀" };
});


// Routes
import { appRoutes } from "./routes";
server.register(appRoutes);

// Start Server
const start = async () => {
    try {
        await server.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server running at http://localhost:${PORT}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
