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
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const transcribeAudio = (fileBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = new form_data_1.default();
    formData.append("file", new Blob([fileBuffer]), "audio.mp3");
    formData.append("model", "whisper-1");
    const response = yield axios_1.default.post("https://api.openai.com/v1/audio/transcriptions", formData, {
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
    });
    return response.data.text;
});
exports.transcribeAudio = transcribeAudio;
//# sourceMappingURL=transcribeHelper.js.map