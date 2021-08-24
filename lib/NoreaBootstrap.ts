import { json, urlencoded } from "body-parser";
import colors from "colors";
import cors from "cors";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import { default as http, default as https } from "http";
import { Server } from "https";
import ExpressParser from "./helpers/ExpressParser";
import {
  AfterStartFunctionType,
  BeforeInitFunctionType,
  BeforeStartFunctionType,
  INoreaBootstrap,
  NoreaApplication,
} from "./interfaces";
import BootstrapInitMethods from "./interfaces/BootstrapInitParamsType";
import { BeforeServerListeningFunctionType } from "./interfaces/INoreaBootstrap";
import { Middleware } from "./middleware";
import AppRoutes from "./route/AppRoutes";

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
   * Called before the server starts listening
   * @param {BeforeServerListeningFunctionType<T>} callback
   */
  beforeServerListening(
    callback: BeforeServerListeningFunctionType<Server | http.Server>
  ): void {
    /**
     * App started
     */
    if (this.appStarted) {
      console.log(colors.yellow("Norea.js warning - Setup"));
      console.log(
        colors.yellow(
          "You can't call `beforeServerListening` method when the app already started."
        )
      );
    } else {
      this.init.beforeServerListening = callback;
    }
  }

  /**
   * Set Norea.js Bootstrap setting
   * @param setting boostrap setting
   */
  public updateInitConfig(
    setting: Omit<
      BootstrapInitMethods<NoreaApplication>,
      "beforeServerListening" | "beforeStart" | "afterStart" | "beforeInit"
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
      const {
        afterStart,
        beforeServerListening,
        beforeStart,
        beforeInit,
        ...initRest
      } = this.init;
      this.init = {
        afterStart,
        beforeInit,
        beforeStart,
        beforeServerListening,
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
      this.app.use(json(this.init.bodyParserJsonOptions));

      //support application/x-www-form-urlencoded post data
      if (this.init.bodyParserUrlEncodedOptions) {
        const { extended, ...rest } = this.init.bodyParserUrlEncodedOptions;
        this.app.use(urlencoded({ extended: extended ?? false, ...rest }));
      } else {
        this.app.use(urlencoded({ extended: false }));
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

      /**
       * Gobal errors middlewares
       * ----------------------
       */
      this.app.use(Middleware.errorResponseInJson);

      // App port
      const PORT = process.env.PORT ?? port;

      /**
       * Create server
       */

      // default server
      var defaultServer = process.env.NODE_ENV ? https.Server : http.Server;

      // force https
      if (this.init.forceHttps === true) {
        defaultServer = https.Server;
      }

      // support workers
      if (this.init.supportWorkers === true) {
        defaultServer = http.Server;
      }

      // new server instance
      const server = new defaultServer(this.app);

      // running required code before start listening the server
      await this.init.beforeServerListening?.(server);

      // Start app
      await server.listen(PORT, async () => {
        // set app started
        this.appStarted = true;

        // call after start callback
        if (this.init.afterStart) {
          await this.init.afterStart(this.app, server, Number(PORT));
        } else {
          console.log(
            colors.green(`${this.init.appName ?? "NOREA API"}`.toUpperCase())
          );
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
