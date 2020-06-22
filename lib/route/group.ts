import NoreaRouter from "../interfaces/NoreaRouter";
import express from "express";
import NoreaApplication from "../interfaces/NoreaApplication";
import { RouteGroupParamsType } from "../interfaces";

/**
 * Group many routes to a single block
 * @param prefix group prefix
 * @param middlewares group middlewares
 * @param routes group routes
 */
export function group(
  middlewares: express.RequestHandler[],
  routes: (router: NoreaRouter) => NoreaRouter
) {
  const expressRouter = express.Router({
    mergeParams: true,
  }) as NoreaRouter;

  // add middlewares to router

  if (middlewares.length != 0) {
    expressRouter.use(middlewares);
  }

  // initialize group method
  expressRouter.group = routerGroup;

  // define routes
  routes(expressRouter as any);

  return expressRouter;
}

export function routerGroup(
  this: NoreaRouter,
  prefixOrParams: string | RouteGroupParamsType,
  params?: RouteGroupParamsType
): NoreaRouter {
  /**
   * Extract parameters
   */
  const groupParams = (typeof prefixOrParams === "string"
    ? params
    : prefixOrParams) as RouteGroupParamsType;
  const groupPrefix =
    typeof prefixOrParams === "string" ? prefixOrParams : undefined;

  // Params must always be merged
  const { mergeParams, ...rest } = groupParams.routerOptions ?? {};

  const expressRouter = express.Router({
    mergeParams: true,
    ...rest,
  }) as NoreaRouter;

  // add middlewares to router
  if (groupParams.middlewares && groupParams.middlewares.length != 0) {
    expressRouter.use(groupParams.middlewares);
  }

  // initialize group method
  expressRouter.group = routerGroup;

  // define routes
  groupParams.routes(expressRouter);

  // inject submodule
  if (groupPrefix) {
    this.use(groupPrefix, expressRouter);
  } else {
    this.use(groupPrefix, expressRouter);
  }

  return this;
}

export function applicationGroup(
  this: NoreaApplication,
  prefixOrParams: string | RouteGroupParamsType,
  param?: RouteGroupParamsType
): NoreaApplication {
  /**
   * Extract parameters
   */
  const groupParams = (typeof prefixOrParams === "string"
    ? param
    : prefixOrParams) as RouteGroupParamsType;
  const groupPrefix =
    typeof prefixOrParams === "string" ? prefixOrParams : undefined;

  // Params must always be merged
  const { mergeParams, ...rest } = groupParams.routerOptions ?? {};

  const expressRouter = express.Router({
    mergeParams: true,
    ...rest,
  }) as NoreaRouter;

  // add middlewares to router
  if (groupParams.middlewares && groupParams.middlewares.length != 0) {
    expressRouter.use(groupParams.middlewares);
  }

  // initialize group method
  expressRouter.group = routerGroup;

  // define routes
  groupParams.routes(expressRouter);

  // inject submodule
  if (groupPrefix) {
    this.use(groupPrefix, expressRouter);
  } else {
    this.use(expressRouter);
  }

  return this;
}
