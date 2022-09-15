import { json, urlencoded } from "body-parser";
import cluster from "cluster";
import colors from "colors";
import cors from "cors";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import { default as http, default as https } from "http";
import { cpus } from "os";
import ExpressParser from "./helpers/ExpressParser";
import {
  AfterStartFunctionType,
  BeforeInitFunctionType,
  BeforeStartFunctionType,
  INoreaBootstrap,
  NoreaApplication
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
  private appPort: number;

  public get port(): number {
    return this.appPort;
  }

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
    this.app = ExpressParser.parseApplication(init?.app ?? express(), {
      appName: init?.appName ?? init?.app?.appName,
      secretKey: init?.secretKey ?? init?.app?.secretKey,
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
    callback: BeforeServerListeningFunctionType<NoreaApplication>
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
        app,
        afterStart,
        beforeInit,
        beforeStart,
        beforeServerListening,
        ...initRest
      } = this.init;
      this.init = {
        app,
        afterStart,
        beforeInit,
        beforeStart,
        beforeServerListening,
        bodyParser: setting.bodyParser ?? initRest.bodyParser,
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
      this.app.appName = setting.appName ?? initRest.appName ?? app?.appName;
      this.app.secretKey =
        setting.secretKey ?? initRest.secretKey ?? app?.secretKey;
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
  public afterStart(
    this: NoreaBootstrap,
    value: AfterStartFunctionType<NoreaApplication>
  ) {
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
   * @param port server port, default value
   */
  public async start(port: number | boolean = true) {
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
      if (this.init.enableCors !== false) {
        this.app.use(cors(this.init.corsOptions));
      }

      // support application/json type post data
      if (
        this.init.bodyParser?.json === true ||
        this.init.bodyParser?.json === undefined
      ) {
        this.app.use(json({}) as any);
      } else if (this.init.bodyParser?.json) {
        this.app.use(json(this.init.bodyParser?.json) as any);
      }

      //support application/x-www-form-urlencoded post data
      if (
        this.init.bodyParser?.urlEncoded === true ||
        this.init.bodyParser?.urlEncoded === undefined
      ) {
        this.app.use(urlencoded({ extended: false }) as any);
      } else if (this.init.bodyParser?.urlEncoded) {
        const { extended, ...rest } = this.init.bodyParser.urlEncoded;
        this.app.use(
          urlencoded({ extended: extended ?? false, ...rest }) as any
        );
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

      if (typeof port === "boolean") {
        if (port === false) {
          // App port
          this.appPort = undefined;
        } else {
          // App port
          this.appPort = process.env.PORT
            ? Number(process.env.PORT)
            : undefined;
        }
      } else if (typeof port === "number") {
        // App port
        this.appPort = port;
      } else {
        // App port
        this.appPort = process.env.PORT ? Number(process.env.PORT) : undefined;
      }

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

      // Listen to check expectation
      server.on("checkExpectation", this.app);

      // running required code before start listening the server
      await this.init.beforeServerListening?.(server, this.app);

      // Start app
      await server.listen(this.appPort, async () => {
        // set app started
        this.appStarted = true;

        this.info(server);

        // call after start callback
        if (this.init.afterStart) {
          await this.init.afterStart(this.app, server, this.appPort);
        }
      });
    }
  }

  /**
   * Say
   */
  info(server: http.Server | https.Server) {
    console.log(
      "\r\n",
      colors.green(`${this.app.appName ?? "NOREA API"}`.toUpperCase()),
      "\r\n",
      colors.green("===================================================="),
      "\r\n",
      "App name:",
      this.app.appName,
      "\r\n",
      "Express server listening port:",
      this.appPort ?? server.address(),
      "\r\n",
      "Worker:",
      {
        isPrimary: cluster.isPrimary,
        isWorker: cluster.isWorker,
        workerId: cluster.worker?.id,
      },
      "\r\n",
      `Environement :`,
      process.env.NODE_ENV || "local",
      "\r\n",
      "CPUs:",
      cpus().length,
      "\r\n",
      `pid:`,
      process.pid,
      "\r\n"
    );
  }
}
