import express from "express";
import * as core from "express-serve-static-core";
import NoreaRouter from "./NoreaRouter";

declare type RouteGroupParamsType = {
  routerOptions?: express.RouterOptions;
  middlewares?: core.RequestHandler<
    core.ParamsDictionary,
    any,
    any,
    core.Query
  >[];
  routes: (router: NoreaRouter) => void;
};

export default RouteGroupParamsType;
