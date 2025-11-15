import { BooksRepository } from "../repositories/books.repository.js";
import { Book, GoogleBooksResponse, GoogleBooksVolume } from "../types/books.js";

export class BookService {
    constructor(private booksRepository: BooksRepository) {}


    async fetchBooksByISBN(isbn: string): Promise<GoogleBooksVolume | null> {
        const baseUrl = process.env.GOOGLE_BOOKS_BASE_URL;
        const apiKey = process.env.GOOGLE_BOOKS_API;
        const params = new URLSearchParams({
            q: `isbn:${isbn}`,
            ...(apiKey && {key: apiKey}),
        });

        try {
            const response = await fetch(`${baseUrl}?${params}`);

            if(!response.ok) {
                throw new Error(`Google Books API error: ${response.status}`);
            }

            const data: GoogleBooksResponse = await response.json() as GoogleBooksResponse;

            if(data.totalItems === 0 || !data.items || data.items.length === 0) {
                return null;
            }

            return data.items[0] as GoogleBooksVolume;
        } catch(error) {
            console.error('Error fetching book from API:', error)
            throw error;
        }
    }

    async addBooks(data: Book) {
        return this.booksRepository.create(data);
    }

    async findUniqueBook(isbn: string) {
        return this.booksRepository.findById(isbn);
    }

}