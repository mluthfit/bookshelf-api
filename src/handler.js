const { nanoid } = require('nanoid');
const books = require('./books');

const giveResponse = (code, status, message, h) => {
  const response = h.response({
    status,
    message,
  });
  response.code(code);
  return response;
};

const addBook = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  if (name === undefined) return giveResponse(400, 'fail', 'Gagal menambahkan buku. Mohon isi nama buku', h);

  if (readPage > pageCount) return giveResponse(400, 'fail', 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', h);

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
  books.push(newBook);

  const isSuccess = books.filter((item) => item.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  return giveResponse(500, 'error', 'Buku gagal ditambahkan', h);
};

const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name !== undefined) {
    const bookName = books.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
    const response = h.response({
      status: 'success',
      data: {
        books: bookName.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (reading !== undefined) {
    const bookReading = books.filter((item) => item.reading === (reading === '1'));
    const response = h.response({
      status: 'success',
      data: {
        books: bookReading.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (finished !== undefined) {
    const bookFinished = books.filter((item) => item.finished === (finished === '1'));
    const response = h.response({
      status: 'success',
      data: {
        books: bookFinished.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  return response;
};

const getBookById = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((item) => item.id === bookId)[0];

  if (book === undefined) return giveResponse(404, 'fail', 'Buku tidak ditemukan', h);
  const response = h.response({
    status: 'success',
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};

const editBookById = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  const search = books.findIndex((item) => item.id === bookId);
  if (search !== -1) {
    if (name === undefined) return giveResponse(400, 'fail', 'Gagal memperbarui buku. Mohon isi nama buku', h);

    if (readPage > pageCount) return giveResponse(400, 'fail', 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', h);

    books[search] = {
      ...books[search],
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

    return giveResponse(200, 'success', 'Buku berhasil diperbarui', h);
  }

  return giveResponse(404, 'fail', 'Gagal memperbarui buku. Id tidak ditemukan', h);
};

const deleteBookById = (request, h) => {
  const { bookId } = request.params;
  const search = books.findIndex((item) => item.id === bookId);

  if (search === -1) return giveResponse(404, 'fail', 'Buku gagal dihapus. Id tidak ditemukan', h);

  books.splice(search, 1);
  return giveResponse(200, 'success', 'Buku berhasil dihapus', h);
};

module.exports = {
  addBook, getAllBooks, getBookById, editBookById, deleteBookById,
};
