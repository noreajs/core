import { Router } from "express";
import ExpressParser from "../helpers/ExpressParser";
import RouteGroupParamsType from "../interfaces/RouteGroupParamsType";

class Route {
  /**
   * Group routes together to make it a module
   * @param params group params
   */
  static group(params: RouteGroupParamsType): Router {
    // Params must always be merged
    const { mergeParams, ...rest } = params.routerOptions ?? {};

    const expressRouter = ExpressParser.parseRouter(
      Router({
        mergeParams: true,
        ...rest,
      })
    );

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
