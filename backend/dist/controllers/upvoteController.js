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
exports.getUpvotesByCitizen = exports.getUpvotesByComplaint = void 0;
const client_1 = require("@prisma/client");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const big_integer_1 = __importDefault(require("big-integer"));
const prisma = new client_1.PrismaClient();
// GET /api/upvotes/complaint/:complaintId
exports.getUpvotesByComplaint = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const upvotes = yield prisma.upvoted_complaint.findMany({
        where: { complaint_id: BigInt(req.params.complaintId) },
    });
    if (!upvotes.length) {
        throw new asyncHandler_1.CustomError(`No upvotes found for complaint ID ${req.params.complaintId}`, 404);
    }
    res.status(200).json(upvotes.map((u) => (Object.assign(Object.assign({}, u), { upvote_id: (0, big_integer_1.default)(u.upvote_id), complaint_id: (0, big_integer_1.default)(u.complaint_id), citizen_id: (0, big_integer_1.default)(u.citizen_id) }))));
}));
// GET /api/upvotes/citizen/:citizenId
exports.getUpvotesByCitizen = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const upvotes = yield prisma.upvoted_complaint.findMany({
        where: { citizen_id: BigInt(req.params.citizenId) },
    });
    if (!upvotes.length) {
        throw new asyncHandler_1.CustomError(`No upvotes found for citizen ID ${req.params.citizenId}`, 404);
    }
    res.status(200).json(upvotes.map((u) => (Object.assign(Object.assign({}, u), { upvote_id: (0, big_integer_1.default)(u.upvote_id), complaint_id: (0, big_integer_1.default)(u.complaint_id), citizen_id: (0, big_integer_1.default)(u.citizen_id) }))));
}));
//# sourceMappingURL=upvoteController.js.map