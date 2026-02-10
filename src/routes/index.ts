import { FastifyInstance } from "fastify";
import healthRoutes from "./health.routes.js";
import { authRoutes } from "./auth.routes.js";
import { booksRoutes } from "./books.routes.js";
import { libraryRoute } from "./library.routes.js";

export async function registerRoutes(app: FastifyInstance) {
  await app.register(healthRoutes, { prefix: "/health" });
  await app.register(authRoutes);
  await app.register(booksRoutes);
  await app.register(libraryRoute);
}
