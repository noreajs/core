import express, { NextFunction } from "express";
import NoreRouter from './NoreRouter';

/**
 * Group many routes to a single block
 * @param prefix group prefix
 * @param middlewares group middlewares
 * @param routes group routes
 */
export default function group(prefix: string, middlewares: NextFunction[], routes: (router: NoreRouter) => void) {
    const expressRouter = express.Router();

    // add middlewares to router
    
    if (middlewares.length != 0) {
        expressRouter.use(middlewares)
    }

    // define routes
    routes(new NoreRouter(expressRouter, prefix));

    return expressRouter;
}