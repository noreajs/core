import express from "express";
import session from "express-session";
import cors from "cors";
import http from "http";
import https from "http";
import bodyParser from "body-parser";
import AppRoutes from "./route/AppRoutes";
import { NoreaApplication } from "./interfaces";
import ExpressParser from "./helpers/ExpressParser";
import BootstrapInitMethods from "./interfaces/BootstrapInitParamsType";
import helmet from "helmet";
import colors from "colors";

/**
 * Generate session name
 * @param value name
 * @param strict add .sid extension
 */
const sessionName = (value: string, strict: boolean = false) => {
  if (value) {
    if (strict) {
      return value.toLocaleLowerCase();
    } else {
      return `${
        value.toLocaleLowerCase().replace(/\s/g, "-") ?? "session"
      }.sid`;
    }
  } else {
    return `session.sid`;
  }
};

/**
 * Norea.Js application class
 */
export class NoreaBootstrap {
  /**
   * Express application instance
   */
  private app: NoreaApplication;

  /**
   * Application routes
   */
  private routes: AppRoutes;

  /**
   * Initialization parameters
   */
  private init: Omit<
    BootstrapInitMethods<NoreaApplication>,
    "appName" | "secretKey"
  >;

  constructor(routes: AppRoutes, init: BootstrapInitMethods<NoreaApplication>) {
    // set app
    this.app = ExpressParser.parseApplication(express(), {
      appName: init?.appName,
      secretKey: init?.secretKey,
    });

    // set routes
    this.routes = routes;

    // set init parameters
    this.init = init;
  }

  /**
   * Get application instance
   */
  public getApplication() {
    return this.app;
  }

  /**
   * Start your app
   * @param port server port, default value = 3000
   */
  public start(port: number = 3000) {
    // init helmet
    this.app.use(helmet(this.init.helmetConfig));

    // init cors
    this.app.use(cors(this.init.corsOptions));

    // support application/json type post data
    this.app.use(bodyParser.json(this.init.bodyParserJsonOptions));

    //support application/x-www-form-urlencoded post data
    if (this.init.bodyParserUrlEncodedOptions) {
      const { extended, ...rest } = this.init.bodyParserUrlEncodedOptions;
      this.app.use(
        bodyParser.urlencoded({ extended: extended ?? false, ...rest })
      );
    } else {
      this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    // express session
    if (this.init.sessionOptions) {
      this.app.use(
        session({
          secret: this.init.sessionOptions.secret ?? this.app.secretKey,
          resave: this.init.sessionOptions.resave ?? false,
          saveUninitialized: this.init.sessionOptions.saveUninitialized ?? true,
          name:
            sessionName(this.init.sessionOptions.name, true) ??
            sessionName(this.app.appName),
          cookie: this.init.sessionOptions.cookie ?? {
            httpOnly: true,
            secure: this.app.get("env") === "production",
            maxAge: 1000 * 60 * 60, // 1 hour
          },
          store: this.init.sessionOptions.store,
        })
      );
    } else {
      /**
       * Notify for eventual vulnerability
       */
      if (this.app.get("env") === "production") {
        console.log(colors.red("Norea.js warning - Express session"));
        console.log(
          colors.yellow(
            "Session IDs are stored in memory and this is not optimal for a production environment. Set a session store in sessionOptions while initializing the application."
          )
        );
      }

      this.app.use(
        session({
          secret: this.app.secretKey,
          resave: false,
          saveUninitialized: true,
          name: sessionName(this.app.appName),
          cookie: {
            httpOnly: true,
            secure: this.app.get("env") === "production",
            maxAge: 1000 * 60 * 60, // 1 hour
          },
        })
      );
    }

    // before start callback
    if (this.init.beforeStart) {
      this.init.beforeStart(this.app);
    }

    // set middlewares
    if (this.routes.middlewares) {
      this.routes.middlewares(this.app);
    }

    // Set api routes
    this.routes.routes(this.app);

    // App port
    const PORT = process.env.PORT || port;

    /**
     * Create server
     */

    // default server
    const defaultServer = process.env.NODE_ENV ? https.Server : http.Server;

    // new server instance
    const server = new (this.init.forceHttps === true
      ? https.Server
      : defaultServer)(this.app);

    // Start app
    server.listen(PORT, () => {
      // call after start callback
      if (this.init.afterStart) {
        this.init.afterStart(this.app, server, Number(PORT));
      } else {
        console.log(colors.green("NOREA API"));
        console.log(
          colors.green("====================================================")
        );
        console.log("Express server listening on port " + PORT);
        console.log(`Environement : ${process.env.NODE_ENV || "local"}`);
      }
    });
  }
}
