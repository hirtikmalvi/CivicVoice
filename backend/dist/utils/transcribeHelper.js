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
exports.transcribeAudio = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const fs_1 = __importDefault(require("fs")); // for checking dir existence
const genai_1 = require("@google/genai");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const transcribeAudio = (fileBuffer, mimeType) => __awaiter(void 0, void 0, void 0, function* () {
    const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    // Ensure the "temp" folder exists
    const tempDir = path_1.default.join(__dirname, "..", "temp");
    if (!fs_1.default.existsSync(tempDir)) {
        yield promises_1.default.mkdir(tempDir, { recursive: true });
    }
    const tempPath = path_1.default.join(tempDir, `audio_${Date.now()}.mp3`);
    yield promises_1.default.writeFile(tempPath, fileBuffer);
    try {
        const uploadedMedia = yield ai.files.upload({
            file: tempPath,
            config: { mimeType },
        });
        const response = yield ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: (0, genai_1.createUserContent)([
                (0, genai_1.createPartFromUri)(uploadedMedia.uri, uploadedMedia.mimeType),
                "Transcribe the spoken content in this audio. Return only the text in plain format. Identify the language. Transcribed text must only be in English",
            ]),
        });
        return response.text.trim();
    }
    catch (error) {
        throw new asyncHandler_1.CustomError("Some error has occurred while transcribing audio", 500);
    }
    finally {
        yield promises_1.default.unlink(tempPath); // cleanup
    }
});
exports.transcribeAudio = transcribeAudio;
//# sourceMappingURL=transcribeHelper.js.map