import express from "express";
import * as core from "express-serve-static-core";
import NoreaRouter from "./NoreaRouter";

export type RouteGroupParamsType = {
  routerOptions?: express.RouterOptions;
  middlewares?: core.RequestHandler<
    core.ParamsDictionary,
    any,
    any,
    core.Query
  >[];
  routes: (router: NoreaRouter) => void;
};

class Route {
  /**
   * Group routes together to make it a module
   * @param params group params
   */
  static group(params: RouteGroupParamsType): core.Router {
    // Params must always be merged
    const { mergeParams, ...rest } = params.routerOptions ?? {};

    const expressRouter = express.Router({
      mergeParams: true,
      ...rest,
    });

    // add middlewares to router

    if (params.middlewares && params.middlewares.length != 0) {
      expressRouter.use(params.middlewares);
    }

    // define routes
    params.routes(expressRouter);

    return expressRouter;
  }
}

export default Route;
