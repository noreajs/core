import { Router, IRoute } from "express";

export default class NoreRouter {
    private prefix: string;
    private router: Router;

    constructor(router: Router, prefix?: string) {
        this.router = router;
        this.prefix = prefix || '';
    }

    route(path: string): IRoute {
        return this.router.route(`${this.prefix}${path}`)
    }
}