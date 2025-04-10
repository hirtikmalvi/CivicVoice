"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mediaController_1 = require("../controllers/mediaController");
const router = express_1.default.Router();
// READ
router.get("/:mediaId", mediaController_1.getMediaById);
router.get("/type/:mediaType", mediaController_1.getMediaByType);
// UPDATE
router.put("/:mediaId", mediaController_1.updateMedia);
router.patch("/:mediaId/type", mediaController_1.updateMediaType);
// DELETE
router.delete("/:mediaId", mediaController_1.deleteMedia);
exports.default = router;
//# sourceMappingURL=mediaRoutes.js.map