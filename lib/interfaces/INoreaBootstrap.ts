import BootstrapInitParamsType from "./BootstrapInitParamsType";

export default interface INoreaBootstrap<T> {
  /**
   * Set Norea.js Bootstrap setting
   * @param setting boostrap setting
   */
  setSetting(
    setting: Omit<
      BootstrapInitParamsType<T>,
      "beforeStart" | "afterStart"
    >
  ): void;

  /**
   * Get application instance
   */
  getApplication(): T;

  /**
   * Start your app
   * @param port server port, default value = 3000
   */
  start(port?: number): void;
}
