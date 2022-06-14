import BootstrapInitParamsType from "./BootstrapInitParamsType";
import http from "http";
import https from "https";
import NoreaApplication from "./NoreaApplication";

export type BeforeInitFunctionType<T> = (app: T) => void | Promise<void>;
export type BeforeServerListeningFunctionType<T> = (
  server: https.Server | http.Server,
  app: T
) => void | Promise<void>;
export type BeforeStartFunctionType<T> = (app: T) => void | Promise<void>;
export type AfterStartFunctionType<T> = (
  app: T,
  server: https.Server | http.Server,
  port: number
) => void | Promise<void>;
export type UpdateInitConfigParamType<T> = Omit<
  BootstrapInitParamsType<T>,
  "beforeStart" | "afterStart" | "beforeInit"
>;

export default interface INoreaBootstrap<T> {
  /**
   * Set Norea.js Bootstrap setting
   * @param {Omit<
      BootstrapInitParamsType<T>,
      "beforeStart" | "afterStart"
    >} setting boostrap setting
   */
  updateInitConfig(setting: UpdateInitConfigParamType<T>): void;

  /**
   * Get application instance
   */
  getApplication(): T;

  /**
   * Called before the server starts listening
   * @param {BeforeServerListeningFunctionType<T>} callback
   */
  beforeServerListening(
    callback: BeforeServerListeningFunctionType<NoreaApplication>
  ): void;

  /**
   * Set beforeInit callback
   * @param {BeforeInitFunctionType<T>} callback method called once the express application has been initialized
   */
  beforeInit(callback: BeforeInitFunctionType<T>): void;

  /**
   * Set beforeStart callback
   * @param {BeforeStartFunctionType<T>} callback method to be called before starting the server
   */
  beforeStart(callback: BeforeStartFunctionType<T>): void;

  /**
   * Set afterStart callback
   * @param {AfterStartFunctionType<T>} callback method to be called immediately after the server has been started
   */
  afterStart(callback: AfterStartFunctionType<T>): void;

  /**
   * Start your app
   * @param port server port, default value = 3000
   */
  start(port?: number): void;
}
