const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage ? true : false;

    // check data that insert by user
    if (name === undefined) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    } else if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    // push new book to array if the form is qualified
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    } else {
        const response = h.response({
            status: "error",
            message: "Buku gagal ditambahkan",
        });
        response.code(500);
        return response;
    }
};

const getAllBook = (request) => {
    const { name } = request.query;
    if (name !== undefined) {
        // eslint-disable-next-line max-len
        const booksFiltered = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
        console.log(booksFiltered);
        if (booksFiltered.length > 0) {
            return {
                status: 'success',
                data: {
                    books: booksFiltered.map((book) => (
                        { id: book.id, name: book.name, publisher: book.publisher }
                    )),
                },
            };
        } else {
            return {
                status: 'success',
                data: {
                    books: books.map((book) => (
                        { id: book.id, name: book.name, publisher: book.publisher }
                    )),
                },
            };
        }
    }

    const { reading } = request.query;
    if (reading !== undefined) {
        if (Number(reading) === 1) {
            return {
                status: 'success',
                data: {
                    books: books.filter((book) => book.reading === true).map((book) => (
                        { id: book.id, name: book.name, publisher: book.publisher }
                    )),
                },
            };
        } else if (Number(reading) === 0) {
            return {
                status: 'success',
                data: {
                    books: books.filter((book) => book.reading === false).map((book) => (
                        { id: book.id, name: book.name, publisher: book.publisher }
                    )),
                },
            };
        }
    }

    const { finished } = request.query;
    if (finished !== undefined) {
        if (Number(finished) === 1) {
            return {
                status: 'success',
                data: {
                    books: books.filter((book) => book.finished === true).map((book) => (
                        { id: book.id, name: book.name, publisher: book.publisher }
                    )),
                },
            };
        } else if (Number(finished) === 0) {
            return {
                status: 'success',
                data: {
                    books: books.filter((book) => book.finished === false).map((book) => (
                        { id: book.id, name: book.name, publisher: book.publisher }
                    )),
                },
            };
        }
    }

    return {
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id, name: book.name, publisher: book.publisher,
            })),
        },
    };
};

const getDetailBook = (request, h) => {
    const { bookId } = request.params;

    // check the book is on the database or no
    const book = books.filter((bk) => bk.id === bookId)[0];
    if (book !== undefined) {
        return {
            status: "success",
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
};

const editBook = (request, h) => {
    // data from user
    const { bookId } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage ? true : false;

    // check data that insert by user
    if (name === undefined) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    } else if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }

    // find book
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: "success",
            message: "Buku berhasil diperbarui",
        });
        response.code(200);
        return response;
    } else {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan",
        });
        response.code(404);
        return response;
    }
};

const deleteBook = (request, h) => {
    const { bookId } = request.params;

    // check index
    const index = books.filter((book) => book.id === bookId);
    if (index.length === 1) {
        books.splice(index, 1);
        const response = h.response({
            status: "success",
            message: "Buku berhasil dihapus",
        });
        response.code(200);
        return response;
    } else {
        const response = h.response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan",
        });
        response.code(404);
        return response;
    }
};

module.exports = {
    addBook,
    getAllBook,
    getDetailBook,
    editBook,
    deleteBook,
};
