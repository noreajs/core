import { Router, IRoute } from "express";

/**
 * Norea router
 */
export default class NoreaRouter {
    private prefix: string;
    private router: Router;

    constructor(router: Router, prefix?: string) {
        this.router = router;
        this.prefix = prefix || '';
    }

    /**
     * Add prefix path to the given route path and return the route instance
     * @param path route path
     */
    route(path: string): IRoute {
        return this.router.route(`${this.prefix}${path}`)
    }
}