import { Request, Response } from "express";
import { Rule } from "../request/validation/rules/Rule";
import { Validator } from "../request/validation/validator";
import AppRoutes from "../route/AppRoutes";
import moment from "moment";

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
                    username: {
                      type: "string",
                    },
                    name: {
                      type: "string",
                      rules: [Rule.requiredWithout("username")],
                    },
                    email: {
                      type: "string",
                      rules: [Rule.requiredWith("name")],
                    },
                    friends: {
                      type: "array",
                      required: true,
                      validator: {
                        name: {
                          type: "string",
                          rules: [
                            Rule.requiredWhen((data, value, req) => {
                              if (
                                Array.isArray(req.body.user.tags) &&
                                req.body.user.tags.length == 2
                              ) {
                                return "Friend's name is required when tags count equals 2";
                              } else {
                                return false;
                              }
                            }),
                            Rule.startsWith("lam", false),
                            Rule.endsWith("old", false),
                          ],
                        },
                        dob: {
                          type: "date",
                          required: true,
                          rules: [
                            Rule.beforeDate(moment()),
                            Rule.afterDate(moment().year(1995)),
                          ],
                        },
                        createdAt: {
                          type: "date",
                          // required: true,
                          rules: [Rule.afterFields("dob")],
                        },
                      },
                    },
                    tags: {
                      type: "array",
                      required: true,
                      rules: [
                        Rule.among(["blue", "yellow", "red", "white"]),
                        Rule.notAmong(["red", "white"]),
                      ],
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
