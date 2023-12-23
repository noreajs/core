import { ParamsDictionary, RouteParameters } from "express-serve-static-core";
import { INoreaRouter } from "./INoreaRouter";
import RouteGroupParamsType from "./RouteGroupParamsType";

/**
 * Norea router
 */
interface NoreaRouter<RouterParams extends ParamsDictionary = ParamsDictionary> extends INoreaRouter<RouterParams> {
  /**
   * Group many routes to a single block
   * 
   * @param prefix group prefix
   * @param params group params
   */
  group(params: RouteGroupParamsType<RouterParams>): NoreaRouter<RouterParams>;
  group<
    Route extends string,
    P extends ParamsDictionary = RouterParams & RouteParameters<Route>
  >(prefix: Route, params: RouteGroupParamsType<P>): NoreaRouter<P>;
}

export default NoreaRouter;
