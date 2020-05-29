import { Router, IRoute } from "express";

/**
 * Norea router
 */
class NoreaRouter {
    router: Router;

    constructor(router: Router) {
        this.router = router;
    }

    /**
     * Add prefix path to the given route path and return the route instance
     * @param path route path
     */
    route(path: string): IRoute {
        return this.router.route(`${path}`)
    }
}

export default NoreaRouter;