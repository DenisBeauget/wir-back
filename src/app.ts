import Fastify from 'fastify';
import cors from '@fastify/cors';
import { registerRoutes } from './routes/index.js';
import { errorHandler } from './middleware/error-handler.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors);
  app.setErrorHandler(errorHandler);
  await registerRoutes(app);

  return app;
}
