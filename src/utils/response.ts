import {Book} from "../data/books";

interface responseDefault {
    status: string;
    message?: string;
    data?: object;
}

export type ResponseDefault = responseDefault;

const response = (status: string, message: string, data: object): ResponseDefault => {
    return {
        status: status,
        message: message,
        data: data
    }
}

const responseSuccessAddBook = (book: Book): ResponseDefault => {
    return response("success", "Buku berhasil ditambahkan", book);
}

const responseSuccessUpdateBook = (book: Book): ResponseDefault => {
    return response("success", "Buku berhasil diperbarui", book);
}


export {
    response,
    responseSuccessAddBook,
    responseSuccessUpdateBook
};
