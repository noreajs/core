import express, { Application } from "express";
import NoreaRouter from "./NoreaRouter";
import RouteGroupParamsType from "./RouteGroupParamsType";

interface NoreaApplication extends Application {
  /**
   * Group many routes to a single block
   * @param prefix group prefix
   * @param params group params
   */
  group(params: RouteGroupParamsType): NoreaApplication;
  group(prefix: string, params: RouteGroupParamsType): NoreaApplication;
}

export default NoreaApplication;
