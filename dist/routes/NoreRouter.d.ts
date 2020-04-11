import { Router, IRoute } from "express";
export default class NoreRouter {
    private prefix;
    private router;
    constructor(router: Router, prefix?: string);
    route(path: string): IRoute;
}
