"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCitizen = void 0;
const asyncHandler_1 = require("./asyncHandler");
const isCitizen = (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new asyncHandler_1.CustomError("Not authenticated", 401);
    }
    if (user.role !== "Citizen") {
        throw new asyncHandler_1.CustomError("Access denied: Citizens only", 403);
    }
    next();
};
exports.isCitizen = isCitizen;
//# sourceMappingURL=isCitizen.js.map