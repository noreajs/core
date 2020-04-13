import { NextFunction } from "express";
import { Router } from "express";

export function group(prefix: string, middlewares: NextFunction[], routes: (router: NoreaRouter) => void): Router;

export class NoreaRouter { }