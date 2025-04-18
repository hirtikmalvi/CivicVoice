"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const SALT_ROUNDS = 10;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcryptjs_1.default.genSalt(SALT_ROUNDS);
        return yield bcryptjs_1.default.hash(password, salt);
    }
    catch (error) {
        throw new asyncHandler_1.CustomError("Error hashing password", 500);
    }
});
exports.hashPassword = hashPassword;
const comparePassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield bcryptjs_1.default.compare(password, hashedPassword);
    }
    catch (error) {
        throw new asyncHandler_1.CustomError("Error comparing password", 500);
    }
});
exports.comparePassword = comparePassword;
//# sourceMappingURL=hashPassword.js.map