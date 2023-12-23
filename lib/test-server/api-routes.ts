import { Request, Response } from "express";
import { Rule } from "../request/validation/rules/Rule";
import { Validator } from "../request/validation/validator";
import AppRoutes from "../route/AppRoutes";
import moment from "moment";
import { HttpStatus } from "..";
import { Router } from "express";

const rt = Router({ mergeParams: true });

rt.get('/test/:facebookId', (req, res) => {

})

const appRoutes = new AppRoutes({
  routes: (app) => {
    app.group("/api/:version", {
      middlewares: [
        (req, res, next: Function) => {
          return res.status(401).json({
            message: "You are not allowed to access to this service",
          });
        },
      ],
      routes: (module) => {
        module.get("/:id", (req) => {
        })
        /**
         * Login
         */
        module.route("/login/:userId").get(async (req, res) => {
          // throw "hello world.. Fuck you";
          // await new Promise((resolve, rejct) => {
          //   setTimeout(() => {
          //     resolve(true);
          //   }, Math.round(Math.random() * 10 * 1000));
          // });
          return res.status(200).send({
            message: "Login",
            workerId: process.pid,
            params: req.params
          });
        });

        /**
         * Login
         */
        module.route("/login").get(async (req: Request, res: Response) => {
          // throw "hello world.. Fuck you";
          // await new Promise((resolve, rejct) => {
          //   setTimeout(() => {
          //     resolve(true);
          //   }, Math.round(Math.random() * 10 * 1000));
          // });
          return res.status(200).send({
            message: "Login",
            workerId: process.pid,
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

        /**
         * Rule.distinct test
         */
        module.route("/distinct-test").post([
          Validator.validateRequest("body", {
            tags: {
              type: "array",
              required: true,
              rules: [
                Rule.distinct({
                  toString: (value) => {
                    return JSON.stringify(value);
                  },
                }),
              ],
            },
            names: {
              type: "string",
              required: true,
              rules: [Rule.distinct()],
            },
          }),
          (req: Request, res: Response) => {
            return res.status(HttpStatus.Ok).json(req.body);
          },
        ]);

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

export default appRoutes;