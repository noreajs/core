import NoreaRouter from "./NoreaRouter";
import express from "express";

/**
 * Group many routes to a single block
 * @param prefix group prefix
 * @param middlewares group middlewares
 * @param routes group routes
 */
function group(
  middlewares: express.RequestHandler[],
  routes: (router: NoreaRouter) => void
) {
  const expressRouter = express.Router({
    mergeParams: true,
  });

  // add middlewares to router

  if (middlewares.length != 0) {
    expressRouter.use(middlewares);
  }

  // define routes
  routes(expressRouter);

  return expressRouter;
}

export default group;