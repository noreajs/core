import { Router, IRoute } from "express";
export default class NoreaRouter {
    private prefix;
    private router;
    constructor(router: Router, prefix?: string);
    route(path: string): IRoute;
}
