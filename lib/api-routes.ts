import { Application, Request, Response } from "express"
import group from "./route/group";
export default class Routes {
    public routes(app: Application): void {

        app.use(group('/api/v1', [], (router) => {
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
    }

    public middlewares(app: Application): void {

    }
}