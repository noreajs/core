import { Request, Response } from "express";
import { Validator } from "../request/validation/validator";
import AppRoutes from "../route/AppRoutes";

export default new AppRoutes({
  routes: (app) => {
    app.group("/api/v1", {
      middlewares: [
        // (req: Request, res: Response, next: Function) => {
        //   return res.status(401).json({
        //     message: "You are not allowed to access to this service",
        //   });
        // },
      ],
      routes: (module) => {
        /**
         * Login
         */
        module.route("/login").get((req: Request, res: Response) => {
          throw "hello world.. Fuck you";

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

        module.route("/email").get((req: Request, res: Response) => {
          // send email
        });

        module.group("/projects", {
          routes: (r) => {
            r.route("/create").post([
              Validator.validateRequest<{
                user: {
                  name: string;
                  email: string;
                  friends: Array<{ name: string }>;
                  tags: Array<string>;
                };
              }>("body", {
                user: {
                  type: "object",
                  required: true,
                  validator: {
                    name: {
                      type: "string",
                      required: true,
                    },
                    email: {
                      type: "string",
                      required: true,
                    },
                    friends: {
                      type: "array",
                      required: true,
                      validator: {
                        name: {
                          type: "string",
                          required: true,
                        },
                      },
                    },
                    tags: {
                      type: "array",
                      required: true,
                    },
                  },
                },
              }),
              (req: Request, res: Response) => {
                res.status(200).send({
                  message: "All Projects",
                });
              },
            ]);
          },
        });
      },
    });

    app.route("/dashboard").get((req: Request, res: Response) => {
      res.status(200).send({
        message: "Welcome home",
      });
    });
  },
  middlewares: (app) => void {},
});
