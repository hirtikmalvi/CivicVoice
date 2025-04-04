"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const asyncHandler_1 = require("./asyncHandler");
const isAdmin = (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new asyncHandler_1.CustomError("Not authenticated", 401);
    }
    if (user.role !== "admin") {
        throw new asyncHandler_1.CustomError("Access denied: Admins only", 403);
    }
    next();
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=isAdmin.js.map