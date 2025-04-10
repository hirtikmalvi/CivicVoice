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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDescriptionFromContext = exports.generateTitleFromContext = void 0;
const genai_1 = require("@google/genai");
const generateTitleFromContext = (context) => __awaiter(void 0, void 0, void 0, function* () {
    const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Generate one and only one short, clear, and simple title for the civic complaint described as ${context}. The title must be a single line and must summarize the core issue in the most understandable way. Do not include more than one title or variation.`;
    const response = yield ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });
    return response.text;
});
exports.generateTitleFromContext = generateTitleFromContext;
const generateDescriptionFromContext = (context) => __awaiter(void 0, void 0, void 0, function* () {
    const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Generate a complaint description for the context "${context}" in very simple and understandable terms. The description should clearly highlight the civic issue, explain how it affects people, and why it needs to be resolved. Write in a polite and easy-to-understand tone using simple vocabulary. The description should be at least 5 lines long. Do not include the subject/title or any personal details. Just write the complaint description.`;
    const response = yield ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });
    return response.text;
});
exports.generateDescriptionFromContext = generateDescriptionFromContext;
//# sourceMappingURL=complaintHelpter.js.map