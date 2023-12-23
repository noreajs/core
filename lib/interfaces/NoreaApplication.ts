import { Application, RouteParameters, ParamsDictionary } from "express-serve-static-core";
import RouteGroupParamsType from "./RouteGroupParamsType";

interface NoreaApplication<RouterParams = ParamsDictionary> extends Application {
  /**
   * App name
   */
  appName: string;

  /**
   * Secret key
   */
  secretKey: string;

  /**
   * Group many routes to a single block
   * @param prefix group prefix
   * @param params group params
   */
  group(params: RouteGroupParamsType): NoreaApplication;
  group<
    Route extends string,
    P extends ParamsDictionary = RouterParams & RouteParameters<Route>
  >(prefix: Route, params: RouteGroupParamsType<P>): NoreaApplication<P>;
}

export default NoreaApplication;
