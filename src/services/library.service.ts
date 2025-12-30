import { number } from "better-auth";
import { LibraryRepository } from "../repositories/library.repository.js";

export class LibraryService {
  constructor(private libraryRepository: LibraryRepository) {}

  async addBookToUserLibrary(data: { userId: string; bookId: string }) {
    return this.libraryRepository.create(data);
  }

  async deleteBookFromUserLibrary(userId: string, bookId: string) {
    return this.libraryRepository.delete(userId, bookId);
  }

  async retrieveBookInLibrary(userId: string, bookId: string) {
    return this.libraryRepository.findUniqueBookInUserLibrary(userId, bookId);
  }

  async retrieveUserBookById(userBookId: string) {
    return this.libraryRepository.findUserBookById(userBookId);
  }

  async updateBookInLibrary(
    userBookId: string,
    rating: number | null,
    comment: string | null
  ) {
    return this.libraryRepository.updateUniqueBookInUserLibrary(
      userBookId,
      rating,
      comment
    );
  }

  async retrieveAllBooksInLibrary(userId: string) {
    return this.libraryRepository.findAllBooksInUserLibrary(userId);
  }
}
