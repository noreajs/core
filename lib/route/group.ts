import express from "express";
import NoreaRouter from "./NoreaRouter";

/**
 * Group many routes to a single block
 * @param prefix group prefix
 * @param middlewares group middlewares
 * @param routes group routes
*/
const group = function (middlewares: Function[], routes: (router: NoreaRouter) => void) {
    const expressRouter = express.Router({
        mergeParams: true
    });

    // add middlewares to router

    if (middlewares.length != 0) {
        expressRouter.use(middlewares as any)
    }

    // define routes
    routes(new NoreaRouter(expressRouter));

    return expressRouter;
}

module.exports = group;

export default group;