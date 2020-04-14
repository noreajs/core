"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NoreaAppRoutes_1 = __importDefault(require("./route/NoreaAppRoutes"));
const group_1 = __importDefault(require("./route/group"));
exports.default = new NoreaAppRoutes_1.default({
    routes: (app) => {
        app.use(group_1.default('/api/v1', [(req, res, next) => { next(); }], (router) => {
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
    },
    middlewares: (app) => void {}
});
//# sourceMappingURL=api-routes.js.map