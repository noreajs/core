import crypto from "crypto";
import NoreaRouter from "../interfaces/NoreaRouter";
import { routerGroup, applicationGroup } from "../route/group";
import { Application, Router } from "express";
import NoreaApplication from "../interfaces/NoreaApplication";

class ExpressParser {
  /**
   * Parse native express router to norea.js router
   * @param router express router
   */
  parseRouter(router: Router): NoreaRouter {
    const parsed = router as NoreaRouter;
    parsed.group = routerGroup;
    return parsed;
  }

  /**
   * Parse native express application to norea.js application
   * @param app express application
   */
  parseApplication(
    app: Application,
    attributes?: Pick<NoreaApplication, "appName" | "secretKey">
  ): NoreaApplication {
    const parsed = app as NoreaApplication;

    /**
     * Inject route's group method
     */
    parsed.group = applicationGroup;

    /**
     * Attributes to be injected
     */
    if (attributes) {
      parsed.appName = attributes.appName;
      parsed.secretKey =
        attributes.appName ?? crypto.randomBytes(25).toString("hex");
    }

    return parsed;
  }
}

export default new ExpressParser();
