"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const NoreRouter_1 = __importDefault(require("./NoreRouter"));
function group(prefix, middleware, routes) {
    const expressRouter = express_1.default.Router();
    // define routes
    routes(new NoreRouter_1.default(expressRouter, prefix));
    return expressRouter;
}
exports.default = group;
//# sourceMappingURL=group.js.map