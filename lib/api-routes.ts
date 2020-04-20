import NoreaAppRoutes from "./route/NoreaAppRoutes";
import group from "./route/group";
import { Request, Response } from "express";

export default new NoreaAppRoutes({
    routes: (app) => {
        app.use('/api/v1', group([(req: Request, res: Response, next: Function) => {
            return res.status(401).json({
                message: 'You are not allowed to access to this service'
            })
        }], (router) => {
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

        app.route('/dashboard').get((req: Request, res: Response) => {
            res.status(200).send({
                message: 'Welcome home'
            })
        })
    },
    middlewares: (app) => void {

    }
}) 