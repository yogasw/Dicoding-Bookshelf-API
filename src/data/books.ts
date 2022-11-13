import Joi, {CustomHelpers, ErrorReport} from "joi";

interface Book {
    id: number;
    name: string;
    year: number;
    author: string;
    summary: string;
    publisher: string;
    pageCount: number;
    readPage: number;
    reading: boolean;
    finished: boolean;
    insertedAt: Date;
    updatedAt: Date;
}

const BookSchema = Joi.object({
    name: Joi.string().required().error(new Error('Mohon isi nama buku')),
    year: Joi.number().integer().min(1900).max(2021).required(),
    author: Joi.string().required().error(new Error('Mohon isi nama penulis buku')),
    summary: Joi.string().required().error(new Error('Mohon isi ringkasan buku')),
    publisher: Joi.string().required().error(new Error('Mohon isi nama penerbit buku')),
    pageCount: Joi.number().integer().min(1).required().error(new Error('Mohon isi pageCount')),
    readPage: Joi.number()
        .integer()
        .custom((value, helpers: CustomHelpers) => {
            const [{readPage, pageCount}] = helpers.state.ancestors
            if (readPage > pageCount) {
                return helpers.error("readPage>pageCount");
            }
            return value;
        })
        .required()
        .error((error: ErrorReport[]) => {
            if (error[0].code === "readPage>pageCount") {
                return new Error("readPage tidak boleh lebih besar dari pageCount");
            }
            return new Error('Mohon isi jumlah halaman yang sudah dibaca')
        }),
    reading: Joi.boolean().required().error(new Error('Mohon isi reading '))
})


const books: { [key: number]: Book } = {};
let lastBookId = 0;

const getAllBooks = () => {
    return books;
}

const getBookById = (id: number) => {
    return books[id];
}

const addBook = (book: Book) => {
    lastBookId++;
    book.id = lastBookId
    let now = new Date()
    book.insertedAt = now;
    book.updatedAt = now;
    books[book.id] = book;
    return book;
}

const updateBook = (book: Book) => {
    book.updatedAt = new Date();
    book.finished = book.pageCount === book.readPage;
    books[book.id] = {...books[book.id], ...book};
    return books[book.id];
}

const deleteBook = (id: number): Boolean => {
    if (books[id]) {
        delete books[id];
        return true;
    }
    return false;
}

export {
    getAllBooks,
    addBook,
    getBookById,
    updateBook,
    deleteBook,
    BookSchema,
    Book
};
