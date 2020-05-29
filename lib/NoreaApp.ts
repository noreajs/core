import express from "express";
import cors from "cors";
import http from 'http';
import https from 'http';
import bodyParser from "body-parser";
import NoreaAppRoutes from "./route/NoreaAppRoutes";

/**
 * Norea.Js app initialisation's parameter type
 */
export type NoreaAppInitMethods = {
    /**
     * Force app to run on https,
     * false as default value is recommended when the app is running localy.
     * the server runs automatically in https when process.env.NODE_ENV is available
     */
    forceHttps: boolean,

    /**
     * This method is executed during the initialization of the application.
     * It is in this method that external packages are initialized.
     * 
     *  @param {express.Application} app Express application
     * 
     * Example:
     * 
     * ```
     * const app = new NoreaApp(apiRoutes, {
     *     forceHttps: false,
     *     beforeStart: (app) => {
     *          // init cors
     *          app.use(cors());
     *          // support application/json type post data
     *          app.use(bodyParser.json());
     *          //support application/x-www-form-urlencoded post data
     *          app.use(bodyParser.urlencoded({ extended: false }));
     *     },
     * });
     * ```
     */
    beforeStart: (app: express.Application) => void | undefined,

    /**
     * This method is executed after the application has started.
     * 
     *  @param {express.Application} app express application
     *  @param {https.Server | http.Server} server server
     *  @param {number} port application port
     * 
     * Example:
     * 
     * ```
     * const app = new NoreaApp(apiRoutes, {
     *     forceHttps: false,
     *     beforeStart: (app) => {
     *     },
     *     afterStart: (app) => {
     *         console.log('My pretty Api is running now. What a journey!!')
     *     },
     * });
     * ```
     * 
     */
    afterStart: (app: express.Application, server: https.Server | http.Server, port: number) => void | undefined
}

/**
 * Norea.Js application class
 */
export class NoreaApp {

    /**
     * Express application instance
     */
    private app: express.Application;

    /**
     * Application routes
     */
    private routes: NoreaAppRoutes;

    /**
     * Initialization parameters
     */
    private init: NoreaAppInitMethods;

    constructor(routes: NoreaAppRoutes, init: NoreaAppInitMethods) {
        this.app = express();
        this.routes = routes;
        this.init = init;
    }

    /**
     * Get express application instance
     */
    public getExpressApplication() {
        return this.app;
    }

    /**
     * Start your app
     * @param port server port, default value = 3000
     */
    public start(port: number = 3000) {
        // before start callback
        if (this.init.beforeStart) {
            this.init.beforeStart(this.app);
        } else {
            // init cors
            this.app.use(cors());
            // support application/json type post data
            this.app.use(bodyParser.json());
            //support application/x-www-form-urlencoded post data
            this.app.use(bodyParser.urlencoded({ extended: false }));
        }

        // set middlewares
        if (this.routes.middlewares) {
            this.routes.middlewares(this.app);
        }

        // Set api routes
        this.routes.routes(this.app);

        // App port
        const PORT = process.env.PORT || port;

        /**
         * Create server
         */
        // default server
        const defaultServer = process.env.NODE_ENV ? https.Server : http.Server;
        // new server instance
        const server = new (this.init.forceHttps ? https.Server : defaultServer)(this.app);

        // Start app
        server.listen(PORT, () => {
            // call after start callback
            if (this.init.afterStart) {
                this.init.afterStart(this.app, server, Number(PORT));
            } else {
                console.log('NOREA API');
                console.log('====================================================');
                console.log('Express server listening on port ' + PORT);
                console.log(`Environement : ${process.env.NODE_ENV || 'local'}`);
            }
        })
    }

}