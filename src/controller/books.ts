import {Request, ResponseToolkit} from "@hapi/hapi";
import {getAllBooks, Book, addBook, BookSchema, getBookById, updateBook, deleteBook} from "../data/books";
import {ResponseDefault, responseSuccessAddBook, responseSuccessUpdateBook} from "../utils/response";

const getAllBooksRequest = async (req: Request, res: ResponseToolkit) => {
    let result = Object.values(getAllBooks())
        ?.filter((book) => {
            if (req.query.name) {
                return book.name.toLowerCase().includes(req.query.name.toLowerCase());
            } else if (req.query.reading) {
                return book.reading === (req.query.reading === "1" || req.query.reading === "true");
            } else if (req.query.finished) {
                return book.finished === (req.query.finished === "1" || req.query.finished === "true");
            }
            return book;
        })
        ?.map(function (value) {
            return {
                id: value.id,
                name: value.name,
                publisher: value.name,
            };
        });

    let response: ResponseDefault = {
        status: "success",
        data: {
            books: result
        },
    }
    return res.response(response).code(200);
}

const getBookByIdRequest = async (req: Request, res: ResponseToolkit) => {
    let book = getBookById(req.params.id)
    if (!book) {
        return res.response({
            status: "fail",
            message: "Buku tidak ditemukan"
        }).code(404);
    }
    let response: ResponseDefault = {
        status: "success",
        data: {
            book: book
        },
    }
    return res.response(response).code(200);
}

const addBookRequest = async (req: Request, res: ResponseToolkit) => {
    let book: Book = req.payload as Book;
    let response: ResponseDefault;

    const {error} = BookSchema.validate(book)
    book.finished = book.pageCount === book.readPage;

    if (error) {
        response = {
            status: "fail",
            message: `Gagal menambahkan buku. ${error.message}`
        }
        return res.response(response).code(400);
    } else {
        let result = addBook(book);
        return res.response(responseSuccessAddBook({
            ...result,
            ...{
                bookId: result.id,
            }
        })).code(201);
    }

}

const updateBookRequest = async (req: Request, res: ResponseToolkit) => {
    let book: Book = req.payload as Book;
    let bookId = req.params.id;
    let currentBook = getBookById(bookId);
    let response: ResponseDefault;
    if (!currentBook) {
        response = {
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan"
        }
        return res.response(response).code(404);
    } else {
        const {error} = BookSchema.validate(book)
        if (error) {
            response = {
                status: "fail",
                message: `Gagal memperbarui buku. ${error.message}`
            }
            return res.response(response).code(400);
        } else {
            book.id = currentBook.id
            let result = updateBook(book);
            return res.response(responseSuccessUpdateBook(result)).code(200);
        }
    }
}

const deleteBookRequest = async (req: Request, res: ResponseToolkit) => {
    let bookId = req.params.id;
    let currentBook = deleteBook(bookId);
    let response: ResponseDefault;
    if (!currentBook) {
        response = {
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan"
        }
        return res.response(response).code(404);
    } else {
        response = {
            status: "success",
            message: "Buku berhasil dihapus"
        }
        return res.response(response).code(200);
    }
}

export {
    getAllBooksRequest,
    addBookRequest,
    getBookByIdRequest,
    updateBookRequest,
    deleteBookRequest
}
