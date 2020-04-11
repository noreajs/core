"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const api_routes_1 = __importDefault(require("./api-routes"));
class App {
    constructor() {
        this.routePrv = new api_routes_1.default();
        this.app = express_1.default();
        this.config();
        // Set api routes
        this.routePrv.routes(this.app);
        // set middleware
        this.routePrv.middlewares(this.app);
    }
    config() {
        // init cors
        this.app.use(cors_1.default());
        // support application/json type post data
        this.app.use(body_parser_1.default.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map