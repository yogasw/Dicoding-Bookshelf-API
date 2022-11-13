import {Request, ResponseToolkit, ServerRoute} from "@hapi/hapi";
import {
    addBookRequest,
    getAllBooksRequest,
    getBookByIdRequest,
    updateBookRequest,
    deleteBookRequest
} from "../controller/books";


const routes: ServerRoute[] = [
    {
        method: '*',
        path: '/',
        handler: (request: Request, h: ResponseToolkit) => {
            return 'Hello World!';
        }
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksRequest
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getBookByIdRequest
    },
    {
        method: 'POST',
        path: '/books',
        handler: addBookRequest
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: updateBookRequest
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: deleteBookRequest
    }


];

export default routes;
