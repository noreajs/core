import { NextFunction } from "express";
import NoreaRouter from './NoreaRouter';
/**
 * Group many routes to a single block
 * @param prefix group prefix
 * @param middlewares group middlewares
 * @param routes group routes
 */
export default function group(prefix: string, middlewares: NextFunction[], routes: (router: NoreaRouter) => void): import("express-serve-static-core").Router;
