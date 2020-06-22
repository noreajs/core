import { NoreaApplication, AppRoutesInitParamsType } from '../interfaces';

/**
 * Norea.Js app routes definitions,
 * Instantiate this class and define the different routes of your API
 */
export default class AppRoutes {
    /**
     * Filters that are applied before the application routes
     */
    middlewares: (app: NoreaApplication) => void | undefined;

    /**
     * Application routes definition method
     */
    routes: (app: NoreaApplication) => void;

    constructor(init: AppRoutesInitParamsType<NoreaApplication>) {
        this.middlewares = init.middlewares;
        this.routes = init.routes;
    }
}