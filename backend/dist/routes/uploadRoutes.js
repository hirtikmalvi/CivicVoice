"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const uploadController_1 = require("../controllers/uploadController");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
// To upload file/files for complaint
router.post("/complaint/:complaintId", upload.single("file"), (req, res, next) => (0, uploadController_1.genericUpload)({
    folder: "complaints",
    model: "complaint_media",
    foreignKey: {
        field: "complaint_id",
        value: req.params.complaintId,
    },
})(req, res, next));
//# sourceMappingURL=uploadRoutes.js.map