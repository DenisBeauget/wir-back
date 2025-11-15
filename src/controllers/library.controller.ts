import { FastifyReply, FastifyRequest } from "fastify";
import { LibraryService } from "../services/library.service.js";
import { Book } from "../types/books.js";
import { BookService } from "../services/books.service.js";

export class LibraryController {
    constructor(private libraryService: LibraryService, private bookService: BookService) {}


    async addBookToLibrary(request: FastifyRequest<{ Body: Book}>, reply: FastifyReply) {
    try {
        if (!request.user) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

        const userId = request.user.id;
        const data = request.body;

        let book = await this.bookService.findUniqueBook(data.isbn);


        if(!book) {
            book = await this.bookService.addBooks(data)
        }

        const libraryBook = await this.libraryService.retrieveBookInLibrary(userId, book.id);

        if(libraryBook) {
             return reply.code(409).send({ error: 'Already exist' });
        }

        const userBook = await this.libraryService.addBookToUserLibrary({userId: userId,bookId: book.id});
        
        return reply.code(201).send({
            data: userBook
        });
    } catch(error) {
        console.log(error)
        return reply.code(500).send({
        error: 'Internal server error',
      });
    }

    }
}