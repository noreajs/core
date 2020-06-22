import * as core from "express-serve-static-core";
import NoreaRouter from "../interfaces/NoreaRouter";
import { routerGroup, applicationGroup } from "../route/group";
import { Application } from "express";
import NoreaApplication from "../interfaces/NoreaApplication";

class ExpressParser {
  /**
   * Parse native express router to norea.js router
   * @param router express router
   */
  parseRouter(router: core.Router): NoreaRouter {
    const parsed = router as NoreaRouter;
    parsed.group = routerGroup;
    return parsed;
  }

  /**
   * Parse native express application to norea.js application
   * @param app express application
   */
  parseApplication(app: Application): NoreaApplication {
    const parsed = app as NoreaApplication;
    parsed.group = applicationGroup;
    return parsed;
  }
}

export default new ExpressParser();
