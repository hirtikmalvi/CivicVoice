"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthority = void 0;
const asyncHandler_1 = require("./asyncHandler");
const isAuthority = (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new asyncHandler_1.CustomError("Not authenticated", 401);
    }
    if (user.role !== "authority") {
        throw new asyncHandler_1.CustomError("Access denied: Authorities only", 403);
    }
    next();
};
exports.isAuthority = isAuthority;
//# sourceMappingURL=isAuthority.js.map