import NoreaRouter from "./NoreaRouter";
import express from "express";
import * as core from "express-serve-static-core";

/**
 * Group many routes to a single block
 * @param prefix group prefix
 * @param middlewares group middlewares
 * @param routes group routes
 */
function group(
  middlewares: core.RequestHandler<
  core.ParamsDictionary,
    any,
    any,
    core.Query
  >[],
  routes: (router: NoreaRouter) => void
): core.Router {
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