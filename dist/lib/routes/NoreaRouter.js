"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoreaRouter {
    constructor(router, prefix) {
        this.router = router;
        this.prefix = prefix || '';
    }
    route(path) {
        return this.router.route(`${this.prefix}${path}`);
    }
}
exports.default = NoreaRouter;
//# sourceMappingURL=NoreaRouter.js.map