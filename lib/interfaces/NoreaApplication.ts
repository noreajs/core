import { Application } from "express";
import RouteGroupParamsType from "./RouteGroupParamsType";

interface NoreaApplication extends Application {
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
  group(prefix: string, params: RouteGroupParamsType): NoreaApplication;
}

export default NoreaApplication;
