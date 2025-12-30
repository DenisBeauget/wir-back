import { PrismaClient } from "@prisma/client/extension";

export class LibraryRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: { userId: string; bookId: string }) {
    return this.prisma.userBook.create({
      data: { ...data },
      include: { book: true },
    });
  }

  async delete(userId: string, bookId: string) {
    return this.prisma.userBook.delete({
      where: {
        userId_bookId: {
          userId: userId,
          bookId: bookId,
        },
      },
    });
  }

  async findUniqueBookInUserLibrary(userId: string, bookId: string) {
    return this.prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId: userId,
          bookId: bookId,
        },
      },
    });
  }

  async findUserBookById(userBookId: string) {
    return this.prisma.userBook.findUnique({
      where: {
        id: userBookId,
      },
      include: {
        book: true,
      },
    });
  }

  async findAllBooksInUserLibrary(userId: string) {
    return this.prisma.userBook.findMany({
      where: {
        userId: userId,
      },
      include: {
        book: true,
      },
      orderBy: {
        addedAt: "desc",
      },
    });
  }

  async updateUniqueBookInUserLibrary(
    userBookId: string,
    rating: number | null,
    comment: string | null
  ) {
    return this.prisma.userBook.update({
      where: {
        id: userBookId,
      },
      data: {
        rating: rating,
        comment: comment,
      },
      include: {
        book: true,
      },
    });
  }
}
