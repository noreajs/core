"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const NoreRouter_1 = __importDefault(require("./NoreRouter"));
/**
 * Group many routes to a single block
 * @param prefix group prefix
 * @param middlewares group middlewares
 * @param routes group routes
 */
function group(prefix, middlewares, routes) {
    const expressRouter = express_1.default.Router();
    // add middlewares to router
    if (middlewares.length != 0) {
        expressRouter.use(middlewares);
    }
    // define routes
    routes(new NoreRouter_1.default(expressRouter, prefix));
    return expressRouter;
}
exports.default = group;
//# sourceMappingURL=group.js.map