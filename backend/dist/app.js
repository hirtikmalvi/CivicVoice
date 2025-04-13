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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const complaintRoutes_1 = __importDefault(require("./routes/complaintRoutes"));
const data_1 = require("./endpoints_info/data");
const mediaRoutes_1 = __importDefault(require("./routes/mediaRoutes"));
const upvoteRoutes_1 = __importDefault(require("./routes/upvoteRoutes"));
const statisticsRoutes_1 = __importDefault(require("./routes/statisticsRoutes"));
const cors_1 = __importDefault(require("cors"));
const citizenRoutes_1 = __importDefault(require("./routes/citizenRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const authorityRoutes_1 = __importDefault(require("./routes/authorityRoutes"));
//Load environment variable
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
//Middleware to parse Incoming JSON
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// Allow requests from your frontend
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true, // if you're sending cookies or authorization headers
}));
// Routes
app.use("/api/complaints", complaintRoutes_1.default); // Complaint
app.use("/api/media", mediaRoutes_1.default); // Media
app.use("/api/upvote", upvoteRoutes_1.default); // Upvote
app.use("/api/statistics", statisticsRoutes_1.default); //Statistics
app.use("/api/complaints", complaintRoutes_1.default);
app.use('/api/citizen', citizenRoutes_1.default);
app.use('/api/authority', authorityRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
// app.use("/api/upload", uploadRoutes); // Upload  Routes
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(data_1.apiRoutes);
}));
app.listen(PORT, () => console.log(`Server is running on Port ${process.env.PORT}`));
//# sourceMappingURL=app.js.map