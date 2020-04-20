"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NoreaAppRoutes_1 = __importDefault(require("./route/NoreaAppRoutes"));
const group_1 = __importDefault(require("./route/group"));
exports.default = new NoreaAppRoutes_1.default({
    routes: (app) => {
        app.use('/api/v1', group_1.default([(req, res, next) => {
                return res.status(401).json({
                    message: 'You are not allowed to access to this service'
                });
            }], (router) => {
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
        app.route('/dashboard').get((req, res) => {
            res.status(200).send({
                message: 'Welcome home'
            });
        });
    },
    middlewares: (app) => void {}
});
//# sourceMappingURL=api-routes.js.map