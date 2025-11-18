import { FastifyInstance } from "fastify";
import { LibraryService } from "../services/library.service.js";
import { LibraryRepository } from "../repositories/library.repository.js";
import { prisma } from "../utils/prisma.js";
import { BooksRepository } from "../repositories/books.repository.js";
import { BookService } from "../services/books.service.js";
import { LibraryController } from "../controllers/library.controller.js";
import { Book } from "../types/books.js";
import { UserRepository } from "../repositories/user.repository.js";
import { AccountRepository } from "../repositories/account.repository.js";
import { SessionRepository } from "../repositories/session.repository.js";
import { BooksController } from "../controllers/books.controller.js";
import { OAuth2Client } from "google-auth-library";
import { AuthService } from "../services/auth.service.js";
import { AuthController } from "../controllers/auth.controller.js";

export async function libraryRoute(fastify: FastifyInstance) {
  const libraryRepository = new LibraryRepository(prisma);
  const booksRepository = new BooksRepository(prisma);

  const bookService = new BookService(booksRepository);
  const libraryService = new LibraryService(libraryRepository);

  const libraryController = new LibraryController(libraryService, bookService);

  const userRepository = new UserRepository(prisma);
  const accountRepository = new AccountRepository(prisma);
  const sessionRepository = new SessionRepository(prisma);

  const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const authService = new AuthService(
    googleClient,
    userRepository,
    accountRepository,
    sessionRepository
  );

  const authController = new AuthController(authService);

  fastify.post<{ Body: Book }>(
    "/api/library",
    {
      preHandler: authController.authMiddleWare.bind(authController),
    },
    libraryController.addBookToLibrary.bind(libraryController)
  );

  fastify.get(
    "/api/library",
    {
      preHandler: authController.authMiddleWare.bind(authController),
    },
    libraryController.findAllBooksFromLibrary.bind(libraryController)
  );

  fastify.delete<{ Params: { bookId: string } }>(
    "/api/library/:bookId",
    {
      preHandler: authController.authMiddleWare.bind(authController),
    },
    libraryController.deleteBookFromLibrary.bind(libraryController)
  );
}
