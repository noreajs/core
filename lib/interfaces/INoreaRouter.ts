import { Application, RequestHandler, RouteParameters, RequestHandlerParams, ParamsDictionary, RequestParamHandler, PathParams } from "express-serve-static-core";
import { ParsedQs } from "qs";

/* eslint-disable @definitelytyped/no-unnecessary-generics */
export interface IRouterMatcher<
    T,
    Method extends "all" | "get" | "post" | "put" | "delete" | "patch" | "options" | "head" = any,
    TopRouteParams extends ParamsDictionary = ParamsDictionary
> {
    <
        Route extends string,
        P = TopRouteParams & RouteParameters<Route>,
        ResBody = any,
        ReqBody = any,
        ReqQuery = ParsedQs,
        LocalsObj extends Record<string, any> = Record<string, any>,
    >(
        // (it's used as the default type parameter for P)
        path: Route,
        // (This generic is meant to be passed explicitly.)
        ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>>
    ): T;
    <
        Path extends string,
        P = TopRouteParams & RouteParameters<Path>,
        ResBody = any,
        ReqBody = any,
        ReqQuery = ParsedQs,
        LocalsObj extends Record<string, any> = Record<string, any>,
    >(
        // (it's used as the default type parameter for P)
        path: Path,
        // (This generic is meant to be passed explicitly.)
        ...handlers: Array<RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, LocalsObj>>
    ): T;
    <
        P = TopRouteParams & ParamsDictionary,
        ResBody = any,
        ReqBody = any,
        ReqQuery = ParsedQs,
        LocalsObj extends Record<string, any> = Record<string, any>,
    >(
        path: PathParams,
        // (This generic is meant to be passed explicitly.)
        ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>>
    ): T;
    <
        P = TopRouteParams & ParamsDictionary,
        ResBody = any,
        ReqBody = any,
        ReqQuery = ParsedQs,
        LocalsObj extends Record<string, any> = Record<string, any>,
    >(
        path: PathParams,
        // (This generic is meant to be passed explicitly.)
        ...handlers: Array<RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, LocalsObj>>
    ): T;
    (path: PathParams, subApplication: Application): T;
}

export interface IRoute<Route extends string = string, TopRouteParams extends ParamsDictionary = ParamsDictionary> {
    path: string;
    stack: any;
    all: IRouterHandler<this, Route, TopRouteParams>;
    get: IRouterHandler<this, Route, TopRouteParams>;
    post: IRouterHandler<this, Route, TopRouteParams>;
    put: IRouterHandler<this, Route, TopRouteParams>;
    delete: IRouterHandler<this, Route, TopRouteParams>;
    patch: IRouterHandler<this, Route, TopRouteParams>;
    options: IRouterHandler<this, Route, TopRouteParams>;
    head: IRouterHandler<this, Route, TopRouteParams>;

    checkout: IRouterHandler<this, Route, TopRouteParams>;
    copy: IRouterHandler<this, Route, TopRouteParams>;
    lock: IRouterHandler<this, Route, TopRouteParams>;
    merge: IRouterHandler<this, Route, TopRouteParams>;
    mkactivity: IRouterHandler<this, Route, TopRouteParams>;
    mkcol: IRouterHandler<this, Route, TopRouteParams>;
    move: IRouterHandler<this, Route, TopRouteParams>;
    "m-search": IRouterHandler<this, Route, TopRouteParams>;
    notify: IRouterHandler<this, Route, TopRouteParams>;
    purge: IRouterHandler<this, Route, TopRouteParams>;
    report: IRouterHandler<this, Route, TopRouteParams>;
    search: IRouterHandler<this, Route, TopRouteParams>;
    subscribe: IRouterHandler<this, Route, TopRouteParams>;
    trace: IRouterHandler<this, Route, TopRouteParams>;
    unlock: IRouterHandler<this, Route, TopRouteParams>;
    unsubscribe: IRouterHandler<this, Route, TopRouteParams>;
}

export interface IRouterHandler<T, Route extends string = string, TopRouteParams extends ParamsDictionary = ParamsDictionary> {
    (...handlers: Array<RequestHandler<TopRouteParams & RouteParameters<Route>>>): T;
    (...handlers: Array<RequestHandlerParams<TopRouteParams & RouteParameters<Route>>>): T;
    <
        P = TopRouteParams & RouteParameters<Route>,
        ResBody = any,
        ReqBody = any,
        ReqQuery = ParsedQs,
        LocalsObj extends Record<string, any> = Record<string, any>,
    >(
        // (This generic is meant to be passed explicitly.)
        // eslint-disable-next-line @definitelytyped/no-unnecessary-generics
        ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>>
    ): T;
    <
        P = TopRouteParams & RouteParameters<Route>,
        ResBody = any,
        ReqBody = any,
        ReqQuery = ParsedQs,
        LocalsObj extends Record<string, any> = Record<string, any>,
    >(
        // (This generic is meant to be passed explicitly.)
        // eslint-disable-next-line @definitelytyped/no-unnecessary-generics
        ...handlers: Array<RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, LocalsObj>>
    ): T;
    <
        P = TopRouteParams & ParamsDictionary,
        ResBody = any,
        ReqBody = any,
        ReqQuery = ParsedQs,
        LocalsObj extends Record<string, any> = Record<string, any>,
    >(
        // (This generic is meant to be passed explicitly.)
        // eslint-disable-next-line @definitelytyped/no-unnecessary-generics
        ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>>
    ): T;
    <
        P = TopRouteParams & ParamsDictionary,
        ResBody = any,
        ReqBody = any,
        ReqQuery = ParsedQs,
        LocalsObj extends Record<string, any> = Record<string, any>,
    >(
        // (This generic is meant to be passed explicitly.)
        // eslint-disable-next-line @definitelytyped/no-unnecessary-generics
        ...handlers: Array<RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, LocalsObj>>
    ): T;
}

/* eslint-enable @definitelytyped/no-unnecessary-generics */
export interface INoreaRouter<TopRouteParams extends ParamsDictionary> extends RequestHandler<TopRouteParams> {
    /**
     * Map the given param placeholder `name`(s) to the given callback(s).
     *
     * Parameter mapping is used to provide pre-conditions to routes
     * which use normalized placeholders. For example a _:user_id_ parameter
     * could automatically load a user's information from the database without
     * any additional code,
     *
     * The callback uses the samesignature as middleware, the only differencing
     * being that the value of the placeholder is passed, in this case the _id_
     * of the user. Once the `next()` function is invoked, just like middleware
     * it will continue on to execute the route, or subsequent parameter functions.
     *
     *      app.param('user_id', function(req, res, next, id){
     *        User.find(id, function(err, user){
     *          if (err) {
     *            next(err);
     *          } else if (user) {
     *            req.user = user;
     *            next();
     *          } else {
     *            next(new Error('failed to load user'));
     *          }
     *        });
     *      });
     */
    param(name: string, handler: RequestParamHandler): this;

    /**
     * Alternatively, you can pass only a callback, in which case you have the opportunity to alter the app.param()
     *
     * @deprecated since version 4.11
     */
    param(callback: (name: string, matcher: RegExp) => RequestParamHandler): this;

    /**
     * Special-cased "all" method, applying the given route `path`,
     * middleware, and callback to _every_ HTTP method.
     */
    all: IRouterMatcher<this, "all", TopRouteParams>;
    get: IRouterMatcher<this, "get", TopRouteParams>;
    post: IRouterMatcher<this, "post", TopRouteParams>;
    put: IRouterMatcher<this, "put", TopRouteParams>;
    delete: IRouterMatcher<this, "delete", TopRouteParams>;
    patch: IRouterMatcher<this, "patch", TopRouteParams>;
    options: IRouterMatcher<this, "options", TopRouteParams>;
    head: IRouterMatcher<this, "head", TopRouteParams>;

    checkout: IRouterMatcher<this, any, TopRouteParams>;
    connect: IRouterMatcher<this, any, TopRouteParams>;
    copy: IRouterMatcher<this, any, TopRouteParams>;
    lock: IRouterMatcher<this, any, TopRouteParams>;
    merge: IRouterMatcher<this, any, TopRouteParams>;
    mkactivity: IRouterMatcher<this, any, TopRouteParams>;
    mkcol: IRouterMatcher<this, any, TopRouteParams>;
    move: IRouterMatcher<this, any, TopRouteParams>;
    "m-search": IRouterMatcher<this, any, TopRouteParams>;
    notify: IRouterMatcher<this, any, TopRouteParams>;
    propfind: IRouterMatcher<this, any, TopRouteParams>;
    proppatch: IRouterMatcher<this, any, TopRouteParams>;
    purge: IRouterMatcher<this, any, TopRouteParams>;
    report: IRouterMatcher<this, any, TopRouteParams>;
    search: IRouterMatcher<this, any, TopRouteParams>;
    subscribe: IRouterMatcher<this, any, TopRouteParams>;
    trace: IRouterMatcher<this, any, TopRouteParams>;
    unlock: IRouterMatcher<this, any, TopRouteParams>;
    unsubscribe: IRouterMatcher<this, any, TopRouteParams>;
    link: IRouterMatcher<this, any, TopRouteParams>;
    unlink: IRouterMatcher<this, any, TopRouteParams>;

    use: IRouterHandler<this, string, TopRouteParams> & IRouterMatcher<this, any, TopRouteParams>;

    route<T extends string>(prefix: T): IRoute<T, TopRouteParams>;
    route(prefix: PathParams): IRoute<string, TopRouteParams>;
    /**
     * Stack of configured routes
     */
    stack: any[];
}