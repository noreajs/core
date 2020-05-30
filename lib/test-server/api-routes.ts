import { Request, Response } from "express";
import { NoreaAppRoutes } from "..";
import Route from "../route/Route";

export default new NoreaAppRoutes({
  routes: (app) => {
    app.use(
      "/api/v1",
      Route.group({
        middlewares: [
          (req: Request, res: Response, next: Function) => {
            return res.status(401).json({
              message: "You are not allowed to access to this service",
            });
          },
        ],
        routes: (module) => {
          /**
           * Login
           */
          module.route("/login").get((req: Request, res: Response) => {
            res.status(200).send({
              message: "Login",
            });
          });

          /**
           * Register
           */
          module.route("/register").get((req: Request, res: Response) => {
            res.status(200).send({
              message: "Registration",
            });
          });
        },
      })
    );

    app.route("/dashboard").get((req: Request, res: Response) => {
      res.status(200).send({
        message: "Welcome home",
      });
    });
  },
  middlewares: (app) => void {},
});
