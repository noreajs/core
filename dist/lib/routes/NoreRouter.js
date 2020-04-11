"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoreRouter {
    constructor(router, prefix) {
        this.router = router;
        this.prefix = prefix || '';
    }
    route(path) {
        return this.router.route(`${this.prefix}${path}`);
    }
}
exports.default = NoreRouter;
//# sourceMappingURL=NoreRouter.js.map