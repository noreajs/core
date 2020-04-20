import express from "express";

/**
 * Group many routes to a single block
 * @param prefix group prefix
 * @param middlewares group middlewares
 * @param routes group routes
*/
declare function group(middlewares: Function[], routes: (router: NoreaRouter) => void): express.Router;

/**
 * Norea router
 */
declare interface NoreaRouter {
    /**
     * Add prefix path to the given route path and return the route instance
     * @param path route path
     */
    route(path: string): express.IRoute;
}

export {
    group,
    NoreaRouter
}