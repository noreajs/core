import { Application } from "express";
import { AppRoutesInitParamsType } from "../interfaces";

/**
 * Norea.Js app routes definitions,
 * Instantiate this class and define the different routes of your API
 */
export default class NoreaAppRoutes {
  /**
   * Filters that are applied before the application routes
   */
  middlewares: (app: Application) => void | undefined;

  /**
   * Application routes definition method
   */
  routes: (app: Application) => void;

  constructor(init: AppRoutesInitParamsType<Application>) {
    this.middlewares = init.middlewares;
    this.routes = init.routes;
  }
}
