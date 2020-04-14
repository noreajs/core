"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const group_1 = __importDefault(require("./lib/route/group"));
exports.group = group_1.default;
const NoreaRouter_1 = __importDefault(require("./lib/route/NoreaRouter"));
exports.NoreaRouter = NoreaRouter_1.default;
const NoreaAppRoutes_1 = __importDefault(require("./lib/route/NoreaAppRoutes"));
exports.NoreaAppRoutes = NoreaAppRoutes_1.default;
const NoreaApp_1 = require("./lib/NoreaApp");
exports.NoreaApp = NoreaApp_1.NoreaApp;
//# sourceMappingURL=index.js.map