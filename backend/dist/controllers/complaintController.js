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
exports.getComplaintsByDepartment = exports.getComplaintsGroupedByDepartment = exports.getTrendingComplaints = exports.updateComplaintAuthority = exports.updateComplaintCategory = exports.updateComplaintStatus = exports.updateComplaint = exports.removeUpvoteFromComplaint = exports.deleteMediaFromComplaint = exports.deleteComplaint = exports.upvoteComplaint = exports.createComplaint = exports.getUpvoteCountOfComplaint = exports.getAllComplaintsUpvotedByCitizen = exports.getComplaintsByAuthority = exports.getComplaintMedia = exports.getComplaintsByStatus = exports.getComplaintsByCategory = exports.getComplaintsByCitizen = exports.getComplaintById = exports.getComplaints = void 0;
const client_1 = require("@prisma/client");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const big_integer_1 = __importDefault(require("big-integer"));
const uploadToCloudinary_1 = require("../utils/uploadToCloudinary");
const complaintHelpter_1 = require("../utils/complaintHelpter");
const transcribeHelper_1 = require("../utils/transcribeHelper");
const dotenv_1 = __importDefault(require("dotenv"));
const categoryToDepartment_1 = require("../utils/categoryToDepartment");
const convertDepartmentMapToBigInteger_1 = require("../utils/convertDepartmentMapToBigInteger");
dotenv_1.default.config();
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
        include: {
            complaint_media: true
        }
    });
    if (!complaint) {
        throw new asyncHandler_1.CustomError(`Complaint with complaintId: ${req.params.complaintId} Not Found`, 404);
    }
    console.log("complaint media:", complaint.complaint_media[0]);
    return res.json(Object.assign(Object.assign({}, complaint), { complaint_id: (0, big_integer_1.default)(complaint.complaint_id), authority_id: (0, big_integer_1.default)(complaint.authority_id), citizen_id: (0, big_integer_1.default)(complaint.citizen_id), complaint_media: complaint.complaint_media.map((m) => ({
            media_id: (0, big_integer_1.default)(m.media_id),
            complaint_id: (0, big_integer_1.default)(m.complaint_id),
            media_url: m.media_url
        })) }));
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
exports.getAllComplaintsUpvotedByCitizen = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const complaintsUpvotedByCitizen = yield prisma.upvoted_complaint.findMany({
        where: {
            citizen_id: parseInt(req.params.citizenId),
        },
    });
    if (!complaintsUpvotedByCitizen.length) {
        throw new asyncHandler_1.CustomError(`No Complaints are upvoted by citizen_id: ${req.params.citizenId}`, 404);
    }
    return res.json(complaintsUpvotedByCitizen.map((complaint) => (Object.assign(Object.assign({}, complaint), { complaint_id: (0, big_integer_1.default)(complaint.complaint_id), citizen_id: (0, big_integer_1.default)(complaint.citizen_id), upvote_id: (0, big_integer_1.default)(complaint.upvote_id) }))));
}));
exports.getUpvoteCountOfComplaint = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const upvoteCount = yield prisma.upvoted_complaint.count({
        where: {
            complaint_id: parseInt(req.params.complaintId),
        },
    });
    return res.json({
        count: upvoteCount,
    });
}));
// New complaint
exports.createComplaint = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { citizen_id, category, location, latitude, longitude } = req.body;
    let { title, description } = req.body;
    // Access other form data
    const files = req.files;
    if (files && files.length > 5) {
        throw new asyncHandler_1.CustomError("You can upload a maximum of 5 files.", 400);
    }
    let audioFile;
    const mediaFiles = [];
    // Separate audio and image/video files
    if (files) {
        for (const file of files) {
            if (file.mimetype.startsWith("audio") && !audioFile) {
                audioFile = file;
            }
            else if (file.mimetype.startsWith("image") ||
                file.mimetype.startsWith("video")) {
                mediaFiles.push(file);
            }
        }
    }
    // Ensure citizen_id is present
    if (!citizen_id) {
        throw new asyncHandler_1.CustomError("Citizen ID is required.", 400);
    }
    // Convert location string to JSON object
    let locationObject;
    try {
        locationObject = location ? JSON.parse(location) : null;
    }
    catch (error) {
        throw new asyncHandler_1.CustomError("Invalid location format. Must be a JSON string.", 400);
    }
    // Initialize complaintText with the provided description if available
    let complaintText = description || "";
    // Transcribe audio if present
    if (audioFile) {
        const transcribedText = yield (0, transcribeHelper_1.transcribeAudio)(audioFile.buffer, audioFile.mimetype);
        complaintText += ` ${transcribedText}`;
    }
    // Ensure complaint text is present
    if (!complaintText) {
        throw new asyncHandler_1.CustomError("No description or audio provided!", 400);
    }
    // Generate AI-based description and title if not provided
    if (!description) {
        description = yield (0, complaintHelpter_1.generateDescriptionFromContext)(complaintText);
    }
    if (!title) {
        title = yield (0, complaintHelpter_1.generateTitleFromContext)(description);
    }
    // Save complaint in DB
    const complaint = yield prisma.complaint.create({
        data: {
            citizen_id: BigInt(citizen_id),
            title: title,
            description: description,
            category: category || null,
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
        },
    });
    const mediaUrls = [];
    // Upload audio if present
    if (audioFile) {
        const uploadResult = yield (0, uploadToCloudinary_1.uploadToCloudinary)(audioFile.buffer, audioFile.mimetype, "complaints");
        const audioUrl = uploadResult.secure_url;
        mediaUrls.push(audioUrl);
        yield prisma.complaint_media.create({
            data: {
                complaint_id: complaint.complaint_id,
                media_url: uploadResult.secure_url,
                media_type: "audio", // Using "video" instead of "audio" to pass the constraint
            },
        });
    }
    // Upload all image/video files to Cloudinary & store in DB
    if (mediaFiles.length > 0) {
        for (const mediaFile of mediaFiles) {
            const uploadResult = yield (0, uploadToCloudinary_1.uploadToCloudinary)(mediaFile.buffer, mediaFile.mimetype, "complaints");
            mediaUrls.push(uploadResult.secure_url);
            let mediaType = mediaFile.mimetype.startsWith("image")
                ? "image"
                : "video";
            yield prisma.complaint_media.create({
                data: {
                    complaint_id: complaint.complaint_id,
                    media_url: uploadResult.secure_url,
                    media_type: mediaType,
                },
            });
        }
    }
    // Response
    return res.status(201).json({
        message: "Complaint created successfully!",
        complaint: Object.assign(Object.assign({}, complaint), { complaint_id: (0, big_integer_1.default)(complaint.complaint_id), citizen_id: (0, big_integer_1.default)(complaint.citizen_id), mediaUrls }),
    });
}));
// Upvote a complaint
exports.upvoteComplaint = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { complaintId } = req.params;
    const { citizen_id } = req.body;
    if (!citizen_id) {
        throw new asyncHandler_1.CustomError("Citizen ID is required", 400);
    }
    const existingUpvote = yield prisma.upvoted_complaint.findUnique({
        where: {
            complaint_id_citizen_id: {
                complaint_id: BigInt(complaintId),
                citizen_id: BigInt(citizen_id),
            },
        },
    });
    if (existingUpvote) {
        throw new asyncHandler_1.CustomError("You already upvoted this complaint", 409);
    }
    const newUpvote = yield prisma.upvoted_complaint.create({
        data: {
            complaint_id: BigInt(complaintId),
            citizen_id: BigInt(citizen_id),
        },
    });
    res.status(201).json({
        message: "Complaint upvoted successfully",
        upvote: Object.assign(Object.assign({}, newUpvote), { upvote_id: (0, big_integer_1.default)(newUpvote.upvote_id), complaint_id: (0, big_integer_1.default)(newUpvote.complaint_id), citizen_id: (0, big_integer_1.default)(newUpvote.citizen_id) }),
    });
}));
// Delete a complaint
exports.deleteComplaint = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const complaintId = BigInt(req.params.complaintId);
    const existing = yield prisma.complaint.findUnique({
        where: { complaint_id: complaintId },
    });
    if (!existing)
        throw new asyncHandler_1.CustomError("Complaint not found", 404);
    yield prisma.complaint.delete({
        where: { complaint_id: complaintId },
    });
    res.status(200).json({ message: "Complaint deleted successfully" });
}));
// Delete media from a complaint
exports.deleteMediaFromComplaint = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const complaintId = BigInt(req.params.complaintId);
    const mediaId = BigInt(req.params.mediaId);
    const media = yield prisma.complaint_media.findUnique({
        where: { media_id: mediaId },
    });
    if (!media || media.complaint_id !== complaintId) {
        throw new asyncHandler_1.CustomError("Media not found for this complaint", 404);
    }
    yield prisma.complaint_media.delete({
        where: { media_id: mediaId },
    });
    res.status(200).json({ message: "Media deleted successfully" });
}));
// Remove upvote from a complaint
exports.removeUpvoteFromComplaint = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const complaintId = BigInt(req.params.complaintId);
    const citizenId = BigInt(req.params.citizenId);
    const upvote = yield prisma.upvoted_complaint.findUnique({
        where: {
            complaint_id_citizen_id: {
                complaint_id: complaintId,
                citizen_id: citizenId,
            },
        },
    });
    if (!upvote) {
        throw new asyncHandler_1.CustomError("Upvote not found", 404);
    }
    yield prisma.upvoted_complaint.delete({
        where: {
            complaint_id_citizen_id: {
                complaint_id: complaintId,
                citizen_id: citizenId,
            },
        },
    });
    res.status(200).json({ message: "Upvote removed successfully" });
}));
// Update full complaint
exports.updateComplaint = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { complaintId } = req.params;
    const updated = yield prisma.complaint.update({
        where: { complaint_id: BigInt(complaintId) },
        data: req.body, // contains full/partial fields
    });
    res.status(200).json({
        success: true,
        message: "Complaint updated successfully",
        complaint: Object.assign(Object.assign({}, updated), { complaint_id: (0, big_integer_1.default)(updated.complaint_id), citizen_id: (0, big_integer_1.default)(updated.citizen_id), authority_id: (0, big_integer_1.default)(updated.authority_id) }),
    });
}));
// Update status only
exports.updateComplaintStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { complaintId } = req.params;
    const { status } = req.body;
    if (!status)
        throw new asyncHandler_1.CustomError("Status is required", 400);
    const updated = yield prisma.complaint.update({
        where: { complaint_id: BigInt(complaintId) },
        data: { status },
    });
    res.status(200).json({
        success: true,
        message: "Status updated successfully",
        complaint: Object.assign(Object.assign({}, updated), { complaint_id: (0, big_integer_1.default)(updated.complaint_id), citizen_id: (0, big_integer_1.default)(updated.citizen_id), authority_id: (0, big_integer_1.default)(updated.authority_id) }),
    });
}));
// Update category only
exports.updateComplaintCategory = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { complaintId } = req.params;
    const { category } = req.body;
    if (!category)
        throw new asyncHandler_1.CustomError("Category ID is required", 400);
    const updated = yield prisma.complaint.update({
        where: { complaint_id: BigInt(complaintId) },
        data: { category },
    });
    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        complaint: Object.assign(Object.assign({}, updated), { complaint_id: (0, big_integer_1.default)(updated.complaint_id), citizen_id: (0, big_integer_1.default)(updated.citizen_id), authority_id: (0, big_integer_1.default)(updated.authority_id) }),
    });
}));
// Update authority only
exports.updateComplaintAuthority = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { complaintId } = req.params;
    const { authority_id } = req.body;
    if (!authority_id)
        throw new asyncHandler_1.CustomError("Authority ID is required", 400);
    const updated = yield prisma.complaint.update({
        where: { complaint_id: +complaintId },
        data: { authority_id: BigInt(authority_id) },
    });
    res.status(200).json({
        success: true,
        message: "Authority reassigned successfully",
        complaint: Object.assign(Object.assign({}, updated), { complaint_id: (0, big_integer_1.default)(updated.complaint_id), citizen_id: (0, big_integer_1.default)(updated.citizen_id), authority_id: (0, big_integer_1.default)(updated.authority_id) }),
    });
}));
// Trending
exports.getTrendingComplaints = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
    const recentComplaints = yield prisma.complaint.findMany({
        where: {
            created_at: {
                gte: oneDayAgo,
                lte: now,
            },
        },
        include: {
            citizen: {
                include: {
                    users: true,
                },
            },
            _count: {
                select: {
                    upvoted_complaint: true,
                },
            },
        },
    });
    if (recentComplaints.length === 0) {
        return res.status(200).json([]);
    }
    const totalUpvotes = recentComplaints.reduce((sum, c) => sum + c._count.upvoted_complaint, 0);
    const averageUpvotes = totalUpvotes / recentComplaints.length;
    const trending = recentComplaints
        .filter((c) => c._count.upvoted_complaint)
        .map((c) => {
        var _a, _b;
        return ({
            complaint_id: Number(c.complaint_id),
            title: c.title,
            status: c.status,
            upvotes: c._count.upvoted_complaint,
            citizen_name: ((_b = (_a = c.citizen) === null || _a === void 0 ? void 0 : _a.users) === null || _b === void 0 ? void 0 : _b.fullname) || "Unknown",
            created_at: c.created_at,
            citizen_id: Number(c.citizen_id),
        });
    });
    return res.status(200).json(trending);
}));
// Get all complants grouped in departments
exports.getComplaintsGroupedByDepartment = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const complaints = yield prisma.complaint.findMany({
        where: {}, // Optional filters (e.g., zoneId, status)
    });
    if (!complaints || complaints.length === 0) {
        throw new asyncHandler_1.CustomError("No complaints found", 404);
    }
    const departmentMap = {
        Sanitation_Department: [],
        Water_Supply_Department: [],
        Electricity_Department: [],
        Roads___Infrastructure_Department: [],
        Building___Town_Planning_Department: [],
        Public_Health_Department: [],
        Revenue___Property_Tax_Department: [],
        Fire___Emergency_Services: [],
        Environmental_Department: [],
        Transport___Traffic_Department: [],
        Public_Works_Department: [],
        Licensing___Trade_Department: [],
    };
    for (const complaint of complaints) {
        const department = categoryToDepartment_1.categoryToDepartment[complaint.category];
        if (department) {
            departmentMap[department].push(Object.assign(Object.assign({}, complaint), { complaint_id: complaint.complaint_id, citizen_id: complaint.citizen_id, authority_id: complaint.authority_id }));
        }
    }
    const departmentMapBigInt = (0, convertDepartmentMapToBigInteger_1.convertDepartmentMapToBigInteger)(departmentMap);
    res.status(200).json({
        success: true,
        data: {
            // raw: departmentMap, // native Prisma types
            bigInteger: departmentMapBigInt, // converted to BigInteger instances
        },
    });
}));
// get complaints by department
exports.getComplaintsByDepartment = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { department_type: deptParam } = req.params;
    const validDepartments = Object.values(client_1.department_type);
    if (!validDepartments.includes(deptParam)) {
        throw new asyncHandler_1.CustomError("Invalid department type", 400);
    }
    const complaints = yield prisma.complaint.findMany({});
    const filteredComplaints = complaints.filter((complaint) => {
        const department = categoryToDepartment_1.categoryToDepartment[complaint.category];
        return department === deptParam;
    });
    if (filteredComplaints.length === 0) {
        throw new asyncHandler_1.CustomError("No complaints found for this department", 404);
    }
    const filteredComplaintsWithBigInt = filteredComplaints.map((complaint) => (Object.assign(Object.assign({}, complaint), { complaint_id: (0, big_integer_1.default)(complaint.complaint_id), citizen_id: (0, big_integer_1.default)(complaint.citizen_id), authority_id: (0, big_integer_1.default)(complaint.authority_id) })));
    res.status(200).json({
        success: true,
        data: filteredComplaintsWithBigInt,
    });
}));
//# sourceMappingURL=complaintController.js.map