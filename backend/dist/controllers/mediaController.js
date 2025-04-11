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
exports.deleteMedia = exports.updateMediaType = exports.updateMedia = exports.getMediaByType = exports.getMediaById = void 0;
const client_1 = require("@prisma/client");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const big_integer_1 = __importDefault(require("big-integer"));
const prisma = new client_1.PrismaClient();
// GET /api/media/:mediaId
exports.getMediaById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const media = yield prisma.complaint_media.findUnique({
        where: { media_id: BigInt(req.params.mediaId) },
    });
    if (!media) {
        throw new asyncHandler_1.CustomError(`Media with ID ${req.params.mediaId} not found.`, 404);
    }
    res.status(200).json(Object.assign(Object.assign({}, media), { media_id: (0, big_integer_1.default)(media.media_id), complaint_id: (0, big_integer_1.default)(media.complaint_id) }));
}));
// GET /api/media/type/:mediaType
exports.getMediaByType = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.params.mediaType.toLowerCase();
    const media = yield prisma.complaint_media.findMany({
        where: { media_type: type },
    });
    if (!media.length) {
        throw new asyncHandler_1.CustomError(`No media found of type '${type}'.`, 404);
    }
    res.status(200).json(media.map((m) => (Object.assign(Object.assign({}, m), { media_id: (0, big_integer_1.default)(m.media_id), complaint_id: (0, big_integer_1.default)(m.complaint_id) }))));
}));
// PUT /api/media/:mediaId
exports.updateMedia = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { media_url, media_type } = req.body;
    try {
        const updated = yield prisma.complaint_media.update({
            where: { media_id: BigInt(req.params.mediaId) },
            data: { media_url, media_type },
        });
        res.status(200).json({
            message: "Media updated successfully",
            media: Object.assign(Object.assign({}, updated), { media_id: (0, big_integer_1.default)(updated.media_id), complaint_id: (0, big_integer_1.default)(updated.complaint_id) }),
        });
    }
    catch (err) {
        throw new asyncHandler_1.CustomError(`Media with ID ${req.params.mediaId} not found.`, 404);
    }
}));
// PATCH /api/media/:mediaId/type
exports.updateMediaType = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { media_type } = req.body;
    try {
        const updated = yield prisma.complaint_media.update({
            where: { media_id: BigInt(req.params.mediaId) },
            data: { media_type },
        });
        res.status(200).json({
            message: "Media type updated",
            media: Object.assign(Object.assign({}, updated), { media_id: (0, big_integer_1.default)(updated.media_id), complaint_id: (0, big_integer_1.default)(updated.complaint_id) }),
        });
    }
    catch (err) {
        throw new asyncHandler_1.CustomError(`Media with ID ${req.params.mediaId} not found.`, 404);
    }
}));
// DELETE /api/media/:mediaId
exports.deleteMedia = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.complaint_media.delete({
            where: { media_id: BigInt(req.params.mediaId) },
        });
        res.status(200).json({ message: "Media deleted successfully" });
    }
    catch (err) {
        throw new asyncHandler_1.CustomError(`Media with ID ${req.params.mediaId} not found.`, 404);
    }
}));
//# sourceMappingURL=mediaController.js.map