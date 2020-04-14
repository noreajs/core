import { NextFunction, IRoute } from "express";
import { Router } from "express";

/**
 * Group many routes to a single block
 * @param prefix group prefix
 * @param middlewares group middlewares
 * @param routes group routes
*/
declare function group(prefix: string, middlewares: NextFunction[], routes: (router: NoreaRouter) => void): Router;

/**
 * Norea router
 */
declare interface NoreaRouter {
    /**
     * Add prefix path to the given route path and return the route instance
     * @param path route path
     */
    route(path: string): IRoute;
}

export {
    group,
    NoreaRouter
}