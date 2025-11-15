import { FastifyReply, FastifyRequest } from "fastify";
import { BookService } from "../services/books.service.js";

export class BooksController {
    constructor(private bookService: BookService) {}

    async getBookDetails(request: FastifyRequest<{Body: {isbn: string}}>, reply: FastifyReply) {
        const isbn  = request.body.isbn;

        if(!isbn) {
            return reply.code(400).send({ error: 'Missing required parameter'});
        }

        try {
            const book = await this.bookService.fetchBooksByISBN(isbn);

             if (!book) {
                return reply.code(404).send({
                    error: 'Book was not found',
                });
            }

            const formattedBook = {
                id: book.id,
                isbn,
                title: book.volumeInfo.title,
                subtitle: book.volumeInfo.subtitle,
                authors: book.volumeInfo.authors || [],
                publisher: book.volumeInfo.publisher,
                publishedDate: book.volumeInfo.publishedDate,
                description: book.volumeInfo.description,
                pageCount: book.volumeInfo.pageCount,
                categories: book.volumeInfo.categories || [],
                thumbnail: book.volumeInfo.imageLinks?.thumbnail,
                language: book.volumeInfo.language,
        };

            return reply.send( {data: formattedBook}
            );
        } catch(error) {
            console.error('Error getting book details', error);
        }
    }
}