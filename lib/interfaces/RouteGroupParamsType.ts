import { RequestHandler, RouterOptions } from "express";
import NoreaRouter from "./NoreaRouter";

declare type RouteGroupParamsType = {
  routerOptions?: RouterOptions;
  middlewares?: RequestHandler[];
  routes: (router: NoreaRouter) => void;
};

export default RouteGroupParamsType;
