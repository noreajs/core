import { Request, Response } from "express";
import { Validator } from "../request/validation/validator";
import { Rule } from "../request/validation/rules/Rule";
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

        module.group("/projects", {
          routes: (r) => {
            r.route("/all").get([
              Validator.validateRequest<{
                user: string;
                project: boolean;
                name?: string;
              }>("query", {
                user: {
                  type: "string",
                  required: true,
                  rules: [
                    {
                      message: "Say my name bitch!",
                      validator: (value) => {
                        return value === "LAMBOU";
                      },
                    },
                  ],
                },
                project: {
                  type: "bool",
                  required: false,
                },
                name: {
                  type: "string",
                  required: true,
                  rules: [
                    Rule.among(["admin", "user"]),
                    Rule.min("7"),
                  ],
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
