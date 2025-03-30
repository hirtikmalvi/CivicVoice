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
exports.getComplaintsByAuthority = exports.getComplaintMedia = exports.getComplaintsByStatus = exports.getComplaintsByCategory = exports.getComplaintsByCitizen = exports.getComplaintById = exports.getComplaints = void 0;
const client_1 = require("@prisma/client");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const big_integer_1 = __importDefault(require("big-integer"));
const prisma = new client_1.PrismaClient();
exports.getComplaints = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allComplaints = yield prisma.complaint.findMany();
    if (!allComplaints) {
        throw new asyncHandler_1.CustomError("Complaints Not Found", 404);
    }
    return res.json(allComplaints.map((complaint) => (Object.assign(Object.assign({}, complaint), { complaint_id: (0, big_integer_1.default)(complaint.complaint_id), authority_id: (0, big_integer_1.default)(complaint.authority_id), citizen_id: (0, big_integer_1.default)(complaint.citizen_id) }))));
}));
exports.getComplaintById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const complaint = yield prisma.complaint.findUnique({
        where: {
            complaint_id: parseInt(req.params.complaintId),
        },
    });
    if (!complaint) {
        throw new asyncHandler_1.CustomError(`Complaint with complaintId: ${req.params.complaintId} Not Found`, 404);
    }
    return res.json(Object.assign(Object.assign({}, complaint), { complaint_id: (0, big_integer_1.default)(complaint.complaint_id), authority_id: (0, big_integer_1.default)(complaint.authority_id), citizen_id: (0, big_integer_1.default)(complaint.citizen_id) }));
}));
exports.getComplaintsByCitizen = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const complaintsByCitizen = yield prisma.complaint.findMany({
        where: {
            citizen_id: parseInt(req.params.citizenId),
        },
    });
    if (!complaintsByCitizen.length) {
        throw new asyncHandler_1.CustomError(`No Complaints Found For CitizenId: ${req.params.citizenId}`, 404);
    }
    return res.json(complaintsByCitizen.map((complaint) => (Object.assign(Object.assign({}, complaint), { complaint_id: (0, big_integer_1.default)(complaint.complaint_id), authority_id: (0, big_integer_1.default)(complaint.authority_id), citizen_id: (0, big_integer_1.default)(complaint.citizen_id) }))));
}));
exports.getComplaintsByCategory = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Object.keys(client_1.complaint_category).includes(req.params.categoryName)) {
        throw new asyncHandler_1.CustomError(`Invalid Category Name: ${req.params.categoryName}`, 400);
    }
    const complaintsByCategory = yield prisma.complaint.findMany({
        where: {
            category: req.params.categoryName,
        },
    });
    if (!complaintsByCategory.length) {
        throw new asyncHandler_1.CustomError(`No Complaints Found For Category: ${req.params.categoryName}`, 404);
    }
    return res.json(complaintsByCategory.map((complaint) => (Object.assign(Object.assign({}, complaint), { complaint_id: (0, big_integer_1.default)(complaint.complaint_id), authority_id: (0, big_integer_1.default)(complaint.authority_id), citizen_id: (0, big_integer_1.default)(complaint.citizen_id) }))));
}));
exports.getComplaintsByStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Object.keys(client_1.complaint_status).includes(req.params.statusName)) {
        throw new asyncHandler_1.CustomError(`Invalid Status Name: ${req.params.statusName}`, 400);
    }
    const complaintsByStatus = yield prisma.complaint.findMany({
        where: {
            status: req.params.statusName,
        },
    });
    if (!complaintsByStatus.length) {
        throw new asyncHandler_1.CustomError(`No Complaints Found For Status: ${req.params.statusName}`, 404);
    }
    return res.json(complaintsByStatus.map((complaint) => (Object.assign(Object.assign({}, complaint), { complaint_id: (0, big_integer_1.default)(complaint.complaint_id), authority_id: (0, big_integer_1.default)(complaint.authority_id), citizen_id: (0, big_integer_1.default)(complaint.citizen_id) }))));
}));
exports.getComplaintMedia = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const complaintMedia = yield prisma.complaint_media.findMany({
        where: {
            complaint_id: parseInt(req.params.complaintId),
        },
    });
    if (!complaintMedia.length) {
        throw new asyncHandler_1.CustomError(`No Complaint Media Found For complaintId: ${req.params.complaintId}`, 404);
    }
    return res.json(complaintMedia.map((media) => (Object.assign(Object.assign({}, media), { complaint_id: (0, big_integer_1.default)(media.complaint_id), media_id: (0, big_integer_1.default)(media.media_id) }))));
}));
exports.getComplaintsByAuthority = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const complaintsByAuthoriry = yield prisma.complaint.findMany({
        where: {
            authority_id: parseInt(req.params.authorityId),
        },
    });
    if (!complaintsByAuthoriry.length) {
        throw new asyncHandler_1.CustomError(`No Complaints Found For AuthoriryId: ${req.params.authorityId}`, 404);
    }
    return res.json(complaintsByAuthoriry.map((complaint) => (Object.assign(Object.assign({}, complaint), { complaint_id: (0, big_integer_1.default)(complaint.complaint_id), authority_id: (0, big_integer_1.default)(complaint.authority_id), citizen_id: (0, big_integer_1.default)(complaint.citizen_id) }))));
}));
//# sourceMappingURL=complaintController.js.map