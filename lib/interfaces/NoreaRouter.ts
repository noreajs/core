import { Router } from "express";
import RouteGroupParamsType from "./RouteGroupParamsType";

/**
 * Norea router
 */
interface NoreaRouter extends Router {
  /**
   * Group many routes to a single block
   * @param prefix group prefix
   * @param params group params
   */
  group(params: RouteGroupParamsType): NoreaRouter;
  group(prefix: string, params: RouteGroupParamsType): NoreaRouter;
}

export default NoreaRouter;
