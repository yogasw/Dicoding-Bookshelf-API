import { Server, Request, ResponseToolkit } from "@hapi/hapi";
import routes from "./routes";

const init = async () => {
    const server: Server = new Server({
        port: 5000,
        host: 'localhost'
    });
    server.route(routes);
    await server.start();
    console.log('Server running on %s', server.info.uri);
};
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
init();
