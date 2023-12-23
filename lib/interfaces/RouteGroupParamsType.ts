import { RequestHandler, ParamsDictionary } from "express-serve-static-core";
import { RouterOptions } from "express"
import NoreaRouter from "./NoreaRouter";

export default interface RouteGroupParamsType<
  P extends ParamsDictionary = ParamsDictionary
> {
  routerOptions?: RouterOptions;
  middlewares?: RequestHandler<P>[];
  routes: (router: NoreaRouter<P>) => void;
};