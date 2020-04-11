"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const group_1 = __importDefault(require("./routes/group"));
class Routes {
    routes(app) {
        app.use(group_1.default('/api/v1', [], (router) => {
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