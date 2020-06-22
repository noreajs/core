/**
 * Type of parameter used to initialize the initializer of the application routes......., yes you get it
 */
declare type AppRoutesInitParamsType<T> = {
  /**
   * Filters that are applied before the application routes
   */
  middlewares: (app: T) => void | undefined;

  /**
   * Application routes definition method
   */
  routes: (app: T) => void;
};

export default AppRoutesInitParamsType;
