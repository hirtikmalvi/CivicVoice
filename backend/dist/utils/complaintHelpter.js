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
exports.generateDescriptionFromContext = exports.generateTitleFromContext = void 0;
const axios_1 = __importDefault(require("axios"));
const delay_1 = require("../utils/delay");
const generateTitleFromContext = (context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
    yield (0, delay_1.delay)(2000); // 2 second delay
    const prompt = `Generate a title for a complaint based on this context:\n${context}\nTitle:`;
    const response = yield axios_1.default.post("https://api-inference.huggingface.co/models/gpt2", {
        inputs: prompt,
        parameters: {
            max_new_tokens: 10,
            temperature: 0.7,
        },
    }, {
        headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        },
    });
    const generated = ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.generated_text) || "";
    const lines = generated.split("\n");
    const titleLine = lines.find((line) => line.toLowerCase().includes("title:"));
    const title = titleLine
        ? titleLine.split("Title:")[1].trim()
        : generated.trim();
    return title;
});
exports.generateTitleFromContext = generateTitleFromContext;
const generateDescriptionFromContext = (context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
    yield (0, delay_1.delay)(2000); // 2 second delay
    const prompt = `Write a professional complaint description based on the following user input:\n${context}\nDescription:`;
    const response = yield axios_1.default.post("https://api-inference.huggingface.co/models/gpt2", {
        inputs: prompt,
        parameters: {
            max_new_tokens: 100,
            temperature: 0.7,
        },
    }, {
        headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        },
    });
    const generated = ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.generated_text) || "";
    const lines = generated.split("\n");
    const descLine = lines.find((line) => line.toLowerCase().includes("description:"));
    const description = descLine
        ? descLine.split("Description:")[1].trim()
        : generated.trim();
    return description;
});
exports.generateDescriptionFromContext = generateDescriptionFromContext;
//# sourceMappingURL=complaintHelpter.js.map