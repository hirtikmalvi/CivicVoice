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
const genai_1 = require("@google/genai");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transcribeAudio = (fileBuffer, mimeType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const genAI = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        // Create a blob-like object that matches the requirements
        const blob = new Blob([fileBuffer], { type: mimeType });
        // Create file part directly with the blob content
        const filePart = {
            inlineData: {
                data: Buffer.from(fileBuffer).toString("base64"),
                mimeType: mimeType,
            },
        };
        // Use the generative model
        const result = yield genAI.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        filePart,
                        {
                            text: "Transcribe the spoken content in this audio. Return only the text in plain format. Identify the language. Transcribed text must only be in English",
                        },
                    ],
                },
            ],
        });
        return result.text.trim();
    }
    catch (error) {
        console.error("Transcription error:", error);
        throw new asyncHandler_1.CustomError("Some error has occurred while transcribing audio", 500);
    }
});
exports.transcribeAudio = transcribeAudio;
//# sourceMappingURL=transcribeHelper.js.map