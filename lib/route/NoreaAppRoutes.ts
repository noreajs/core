import express from 'express';

/**
 * Type of parameter used to initialize the initializer of the application routes......., yes you get it
 */
type InitMethods = {
    /**
     * Filters that are applied before the application routes
     */
    middlewares: (app: express.Application) => void | undefined,

    /**
     * Application routes definition method
     */
    routes: (app: express.Application) => void
}

/**
 * Norea.Js app routes definitions,
 * Instantiate this class and define the different routes of your API
 */
export default class NoreaAppRoutes {
    /**
     * Filters that are applied before the application routes
     */
    middlewares: (app: express.Application) => void | undefined;

    /**
     * Application routes definition method
     */
    routes: (app: express.Application) => void;

    constructor(init: InitMethods) {
        this.middlewares = init.middlewares;
        this.routes = init.routes;
    }
}