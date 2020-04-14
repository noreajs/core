import NoreaAppRoutes from "./route/NoreaAppRoutes";
import group from "./route/group";
import { Request, Response } from "express";

export default new NoreaAppRoutes({
    routes: (app) => {
        app.use(group('/api/v1', [(req: Request, res: Response, next: Function) => { next() }], (router) => {
            /**
             * Login
             */
            router.route('/login').get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'Login'
                })
            })

            /**
             * Register
             */
            router.route('/register').get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'Registration'
                })
            })
        }));
    },
    middlewares: (app) => void {

    }
}) 