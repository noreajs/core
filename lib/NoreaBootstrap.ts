import express from "express";
import session from "express-session";
import cors from "cors";
import http from "http";
import https from "http";
import bodyParser from "body-parser";
import AppRoutes from "./route/AppRoutes";
import {
  NoreaApplication,
  INoreaBootstrap,
  BeforeInitFunctionType,
  BeforeStartFunctionType,
  AfterStartFunctionType,
} from "./interfaces";
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
export class NoreaBootstrap implements INoreaBootstrap<NoreaApplication> {
  /**
   * App started
   */
  public appStarted: boolean = false;

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
  private init: BootstrapInitMethods<NoreaApplication>;

  constructor(
    routes: AppRoutes,
    init?: BootstrapInitMethods<NoreaApplication>
  ) {
    // set app
    this.app = ExpressParser.parseApplication(express(), {
      appName: init?.appName,
      secretKey: init?.secretKey,
    });

    // set routes
    this.routes = routes;

    // set init parameters
    this.init = init ?? {};
  }

  /**
   * Set Norea.js Bootstrap setting
   * @param setting boostrap setting
   */
  public updateInitConfig(
    setting: Omit<
      BootstrapInitMethods<NoreaApplication>,
      "beforeStart" | "afterStart" | "beforeInit"
    >
  ) {
    /**
     * App started
     */
    if (this.appStarted) {
      console.log(colors.yellow("Norea.js warning - Setup"));
      console.log(
        colors.yellow(
          "You can't call updateInitConfig method when the app already started."
        )
      );
    } else {
      const { afterStart, beforeStart, beforeInit, ...initRest } = this.init;
      this.init = {
        afterStart,
        beforeInit,
        beforeStart,
        bodyParserJsonOptions:
          setting.bodyParserJsonOptions ?? initRest.bodyParserJsonOptions,
        bodyParserUrlEncodedOptions:
          setting.bodyParserUrlEncodedOptions ??
          initRest.bodyParserUrlEncodedOptions,
        corsOptions: setting.corsOptions ?? initRest.corsOptions,
        forceHttps: setting.forceHttps ?? initRest.forceHttps,
        helmetConfig: setting.helmetConfig ?? initRest.helmetConfig,
        sessionOptions: setting.sessionOptions ?? initRest.sessionOptions,
      };

      /**
       * Update app informations
       */
      this.app.appName = setting.appName ?? initRest.appName;
      this.app.secretKey = setting.appName ?? initRest.appName;
    }
  }

  /**
   * Before app initialization callback
   * @param value callback
   */
  public beforeInit(value: BeforeInitFunctionType<NoreaApplication>) {
    /**
     * App started
     */
    if (this.appStarted) {
      console.log(colors.yellow("Norea.js warning - Setup"));
      console.log(
        colors.yellow(
          "You can't call beforeInit method when the app already started."
        )
      );
    } else {
      this.init.beforeInit = value;
    }
  }

  /**
   * Method to be called before starting the server
   * @param value callback
   */
  public beforeStart(value: BeforeStartFunctionType<NoreaApplication>) {
    /**
     * App started
     */
    if (this.appStarted) {
      console.log(colors.yellow("Norea.js warning - Setup"));
      console.log(
        colors.yellow(
          "You can't call beforeStart method when the app already started."
        )
      );
    } else {
      this.init.beforeStart = value;
    }
  }

  /**
   * Method to be called once the server start
   * @param value callback
   */
  public afterStart(value: AfterStartFunctionType<NoreaApplication>) {
    /**
     * App started
     */
    if (this.appStarted) {
      console.log(colors.yellow("Norea.js warning - Setup"));
      console.log(
        colors.yellow(
          "You can't call afterStart method when the app already started."
        )
      );
    } else {
      this.init.afterStart = value;
    }
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
  public async start(port: number = 3000) {
    /**
     * Only when the app has not yet started
     */
    if (!this.appStarted) {
      // before init callback
      if (this.init.beforeInit) {
        await this.init.beforeInit(this.app);
      }

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
            saveUninitialized:
              this.init.sessionOptions.saveUninitialized ?? true,
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

        /**
         * Notify for eventual vulnerability
         */
        if (
          !this.init.sessionOptions.store &&
          this.app.get("env") === "production"
        ) {
          console.log(colors.red("Norea.js warning - Express session"));
          console.log(
            colors.yellow(
              "Session IDs are stored in memory and this is not optimal for a production environment. Set a session store in sessionOptions while initializing the application."
            )
          );
        }
      }

      // before start callback
      if (this.init.beforeStart) {
        await this.init.beforeStart(this.app);
      }

      // set middlewares
      if (this.routes.middlewares) {
        this.routes.middlewares(this.app);
      }

      // Set api routes
      this.routes.routes(this.app);

      // App port
      const PORT = process.env.PORT ?? port;

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
      await server.listen(PORT, async () => {
        // set app started
        this.appStarted = true;

        // call after start callback
        if (this.init.afterStart) {
          await this.init.afterStart(this.app, server, Number(PORT));
        } else {
          console.log(colors.green("NOREA API"));
          console.log(
            colors.green("====================================================")
          );
          console.log("App name:", this.app.appName);
          console.log("Express server listening port:", PORT);
          console.log(`Environement :`, process.env.NODE_ENV || "local");
        }
      });
    }
  }
}
