-- CreateTable
CREATE TABLE "book" (
    "id" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "googleBooksId" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "authors" TEXT[],
    "publisher" TEXT,
    "publishedDate" TEXT,
    "description" TEXT,
    "pageCount" INTEGER,
    "categories" TEXT[],
    "thumbnail" TEXT,
    "language" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_book" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "rating" SMALLINT,
    "comment" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_book_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "book_isbn_key" ON "book"("isbn");

-- CreateIndex
CREATE INDEX "user_book_userId_idx" ON "user_book"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_book_userId_bookId_key" ON "user_book"("userId", "bookId");

-- AddForeignKey
ALTER TABLE "user_book" ADD CONSTRAINT "user_book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_book" ADD CONSTRAINT "user_book_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
