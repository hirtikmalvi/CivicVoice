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
exports.genericUpload = void 0;
const client_1 = require("@prisma/client");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const uploadToCloudinary_1 = require("../utils/uploadToCloudinary");
const big_integer_1 = __importDefault(require("big-integer"));
const prisma = new client_1.PrismaClient();
const genericUpload = (options) => (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { folder, model, foreignKey } = options;
    if (!req.file) {
        throw new asyncHandler_1.CustomError("No file uploaded!", 400);
    }
    const result = yield (0, uploadToCloudinary_1.uploadToCloudinary)(req.file.buffer, req.file.mimetype, folder);
    const data = {
        [foreignKey.field]: BigInt(foreignKey.value),
        media_url: result.secure_url,
        media_type: req.file.mimetype.split("/")[0],
    };
    const newMedia = yield prisma[model].create({ data });
    return res.status(201).json({
        message: "File uploaded successfully!",
        media: Object.assign(Object.assign({}, newMedia), { media_id: (0, big_integer_1.default)(newMedia.media_id), [foreignKey.field]: (0, big_integer_1.default)(newMedia[foreignKey.field]) }),
    });
}));
exports.genericUpload = genericUpload;
//# sourceMappingURL=uploadController.js.map