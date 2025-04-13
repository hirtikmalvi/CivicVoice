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
exports.searchComplaints = exports.getAverageResolutionTime = exports.getRecentComplaints = exports.getMostUpvotedComplaints = exports.getComplaintCountPerStatus = exports.getComplaintCountPerCategory = void 0;
const client_1 = require("@prisma/client");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const big_integer_1 = __importDefault(require("big-integer"));
const date_fns_1 = require("date-fns");
const prisma = new client_1.PrismaClient();
// Complaint Count per Category
exports.getComplaintCountPerCategory = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.complaint.groupBy({
        by: ["category"],
        _count: true,
    });
    res.json(result);
}));
// Complaint Count per Status
exports.getComplaintCountPerStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.complaint.groupBy({
        by: ["status"],
        _count: true,
    });
    res.json(result);
}));
// Most Upvoted Complaints
exports.getMostUpvotedComplaints = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const complaints = yield prisma.complaint.findMany({
        include: {
            upvoted_complaint: true,
        },
    });
    const sorted = complaints
        .map((c) => {
        return {
            complaint_id: (0, big_integer_1.default)(c.complaint_id).toString(),
            citizen_id: (0, big_integer_1.default)(c.citizen_id).toString(),
            authority_id: c.authority_id
                ? (0, big_integer_1.default)(c.authority_id).toString()
                : null,
            title: c.title,
            description: c.description,
            status: c.status,
            category: c.category,
            media_url: c.media_url,
            latitude: c.latitude,
            longitude: c.longitude,
            created_at: c.created_at,
            updated_at: c.updated_at,
            upvotes: c.upvoted_complaint.length,
            upvoted_complaint: c.upvoted_complaint.map((u) => ({
                upvote_id: (0, big_integer_1.default)(u.upvote_id).toString(),
                citizen_id: (0, big_integer_1.default)(u.citizen_id).toString(),
                complaint_id: (0, big_integer_1.default)(u.complaint_id).toString(),
                upvoted_at: u.upvoted_at,
            })),
        };
    })
        .sort((a, b) => b.upvotes - a.upvotes);
    res.json(sorted.slice(0, 10));
}));
// Recently Created Complaints
exports.getRecentComplaints = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const recent = yield prisma.complaint.findMany({
        orderBy: {
            created_at: "desc",
        },
        take: 10,
    });
    res.json(recent.map((c) => (Object.assign(Object.assign({}, c), { complaint_id: (0, big_integer_1.default)(c.complaint_id), citizen_id: (0, big_integer_1.default)(c.citizen_id), authority_id: c.authority_id ? (0, big_integer_1.default)(c.authority_id) : null }))));
}));
// Average Resolution Time (Pending → Resolved)
exports.getAverageResolutionTime = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resolved = yield prisma.complaint.findMany({
        where: {
            status: "Resolved",
        },
        select: {
            created_at: true,
            updated_at: true,
        },
    });
    if (resolved.length === 0) {
        throw new asyncHandler_1.CustomError("No resolved complaints to calculate average time.", 404);
    }
    const totalHours = resolved.reduce((acc, comp) => {
        return (acc +
            (0, date_fns_1.differenceInHours)(new Date(comp.updated_at), new Date(comp.created_at)));
    }, 0);
    const avgHours = totalHours / resolved.length;
    res.json({
        message: "Average resolution time (in days)",
        average_days: (avgHours / 24).toFixed(2),
    });
}));
// Search Complaints by Title/Description
exports.searchComplaints = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchTerm = req.query.query;
    if (!searchTerm) {
        throw new asyncHandler_1.CustomError("Search query is required!", 400);
    }
    const results = yield prisma.complaint.findMany({
        where: {
            OR: [
                {
                    title: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        },
    });
    if (!results.length) {
        return res.status(404).json({ message: "No complaints found." });
    }
    res.json(results.map((c) => ({
        complaint_id: (0, big_integer_1.default)(c.complaint_id).toString(),
        citizen_id: (0, big_integer_1.default)(c.citizen_id).toString(),
        authority_id: c.authority_id ? (0, big_integer_1.default)(c.authority_id).toString() : null,
        title: c.title,
        description: c.description,
        status: c.status,
        category: c.category,
        media_url: c.media_url,
        created_at: c.created_at,
        updated_at: c.updated_at,
    })));
}));
//# sourceMappingURL=statisticsController.js.map