import { PrismaClient } from "@prisma/client/extension";
import { Book } from "../types/books.js";

export class BooksRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(isbn: string) {
    return this.prisma.book.findUnique({
      where: { isbn: isbn },
    });
  }

  async create(data: Book) {
    return this.prisma.book.create({
      data: {
        isbn: data.isbn,
        googleBooksId: data.googleBooksId,
        title: data.title,
        subtitle: data.subtitle,
        authors: data.authors,
        publisher: data.publisher,
        publishedDate: data.publishedDate,
        description: data.description,
        pageCount: data.pageCount,
        categories: data.categories,
        thumbnail: data.thumbnail,
        language: data.language,
      },
    });
  }
}
