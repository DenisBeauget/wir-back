import { PrismaClient } from "@prisma/client/extension";

export class LibraryRepository {
    constructor(private prisma: PrismaClient) {}

     async create(data:{ userId: string, bookId: string}) {
        return this.prisma.userBook.create({
            data: {...data},
            include: {book: true}
        });
    }

    async delete(userId: string, bookId: string) {
        return this.prisma.userBook.delete({
            where: {
                userId_bookId: {
                    userId: userId,
                    bookId: bookId
                }
            }
        });
    }

    async findUniqueBookInUserLibrary(userId: string, bookId: string) {
        return this.prisma.userBook.findUnique({
            where: {
                userId_bookId: {
                    userId: userId,
                    bookId: bookId
                }
            }
        });
    }
    async findAllBooksInUserLibrary(userId: string) {
        return this.prisma.userBook.findMany({
            where: {
                userId: userId
            },
            include: {
                book: true
            },
            orderBy: {
                addedAt: 'desc'
            }
        });
    }

    async updateUniqueBookInUserLibrary(userId: string, bookId: string, rating: number, comment: string) {
        return this.prisma.userBook.update({
            where: {
                userId_bookId: {
                    userId: userId,
                    bookId: bookId
                }
            },
            data: {
                rating: rating,
                comment: comment

            },
            include: {
                book: true
            }
        });
    }

}