import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyIO from 'fastify-socket.io';
import 'dotenv/config';
import { appRoutes } from "./routes";

const PORT = parseInt(process.env.PORT || '3000', 10);

const server = Fastify({ logger: true });

// Start Server
const start = async () => {
    try {
        // Register Plugins
        await server.register(cors, {
            origin: "*"
        });
        await server.register(fastifyIO, {
            cors: {
                origin: "*",
            }
        });

        // Health Check
        server.get('/health', async (request, reply) => {
            return { status: 'ok' };
        });

        server.get('/', async (request, reply) => {
            return { message: "OpsBoard Backend is Running" };
        });

        // Register Routes
        await server.register(appRoutes);

        await server.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server running on port ${PORT}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
