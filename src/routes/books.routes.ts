import { FastifyInstance } from "fastify";
import { BookService } from "../services/books.service.js";
import { BooksController } from "../controllers/books.controller.js";
import { AuthController } from "../controllers/auth.controller.js";
import { AuthService } from "../services/auth.service.js";
import { AccountRepository } from "../repositories/account.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { SessionRepository } from "../repositories/session.repository.js";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../utils/prisma.js";
import { BooksRepository } from "../repositories/books.repository.js";

export async function booksRoutes(fastify: FastifyInstance) {
  const booksRepository = new BooksRepository(prisma);
  const userRepository = new UserRepository(prisma);
  const accountRepository = new AccountRepository(prisma);
  const sessionRepository = new SessionRepository(prisma);

  const booksService = new BookService(booksRepository);
  const booksController = new BooksController(booksService);
  const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const authService = new AuthService(
    googleClient,
    userRepository,
    accountRepository,
    sessionRepository
  );

  const authController = new AuthController(authService);

  fastify.post<{ Body: { isbn: string } }>(
    "/api/books",
    {
      preHandler: authController.authMiddleWare.bind(authController),
    },
    booksController.getBookDetails.bind(booksController)
  );
}
