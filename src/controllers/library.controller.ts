import { FastifyReply, FastifyRequest } from "fastify";
import { LibraryService } from "../services/library.service.js";
import { Book } from "../types/books.js";
import { BookService } from "../services/books.service.js";

export class LibraryController {
  constructor(
    private libraryService: LibraryService,
    private bookService: BookService
  ) {}

  async addBookToLibrary(
    request: FastifyRequest<{ Body: Book }>,
    reply: FastifyReply
  ) {
    try {
      if (!request.user) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const userId = request.user.id;
      const data = request.body;

      let book = await this.bookService.findUniqueBook(data.isbn);

      if (!book) {
        book = await this.bookService.addBooks(data);
      }

      const libraryBook = await this.libraryService.retrieveBookInLibrary(
        userId,
        book.id
      );

      if (libraryBook) {
        return reply.code(409).send({ error: "Already exist" });
      }

      const userBook = await this.libraryService.addBookToUserLibrary({
        userId: userId,
        bookId: book.id,
      });

      return reply.code(201).send({
        data: userBook,
      });
    } catch (error) {
      console.log(error);
      return reply.code(500).send({
        error: "Internal server error",
      });
    }
  }

  async findAllBooksFromLibrary(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const userBooks = await this.libraryService.retrieveAllBooksInLibrary(
        request.user.id
      );

      return reply.send({
        data: userBooks,
        count: userBooks.length,
      });
    } catch (error) {
      console.log(error);
      return reply.code(500).send({
        error: "Internal server error",
      });
    }
  }

  async deleteBookFromLibrary(
    request: FastifyRequest<{ Params: { bookId: string } }>,
    reply: FastifyReply
  ) {
    try {
      if (!request.user) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      await this.libraryService.deleteBookFromUserLibrary(
        request.user.id,
        request.params.bookId
      );

      return reply.send({
        messsage: "book successfully deleted",
      });
    } catch (error) {
      console.log(error);
      return reply.code(500).send({
        error: "Internal server error",
      });
    }
  }

  async findSpecificBookFromLibrary(
    request: FastifyRequest<{ Params: { bookId: string } }>,
    reply: FastifyReply
  ) {
    try {
      if (!request.user) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const resultBook = await this.libraryService.retrieveBookInLibrary(
        request.user.id,
        request.params.bookId
      );

      return reply.send({
        data: resultBook,
      });
    } catch (error) {
      console.log(error);
      return reply.code(500).send({
        error: "Internal server error",
      });
    }
  }

  async updateSpecificBookFromLibrary(
    request: FastifyRequest<{
      Params: { bookId: string };
      Body: {
        comment: string;
        rating: number;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      if (!request.user) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const actualBook = await this.libraryService.retrieveBookInLibrary(
        request.user.id,
        request.params.bookId
      );
      let comment: string = "";
      let rating: number;

      if (actualBook) {
        comment =
          request.body.comment != null
            ? request.body.comment
            : actualBook.comment;
        rating =
          request.body.rating != null ? request.body.rating : actualBook.rating;

        const resultBook = await this.libraryService.updateBookInLibrary(
          request.user.id,
          request.params.bookId,
          rating,
          comment
        );

        return reply.send({
          data: resultBook,
        });
      } else {
        return reply.code(404).send({
          error: "Not found",
        });
      }
    } catch (error) {
      console.log(error);
      return reply.code(500).send({
        error: "Internal server error",
      });
    }
  }
}
