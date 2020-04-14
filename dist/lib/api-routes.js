"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import group from "./route/group";
const __1 = require("..");
class Routes {
    routes(app) {
        app.use(__1.group('/api/v1', [(req, res, next) => { next(); }], (router) => {
            /**
             * Login
             */
            router.route('/login').get((req, res) => {
                res.status(200).send({
                    message: 'Login'
                });
            });
            /**
             * Register
             */
            router.route('/register').get((req, res) => {
                res.status(200).send({
                    message: 'Registration'
                });
            });
        }));
    }
    middlewares(app) {
    }
}
exports.default = Routes;
//# sourceMappingURL=api-routes.js.map