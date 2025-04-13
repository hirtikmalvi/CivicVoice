import express, { json } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import complaintRoutes from "./routes/complaintRoutes";
import { apiRoutes } from "./endpoints_info/data";
import userRoutes from "./routes/userRoutes";
import mediaRoutes from "./routes/mediaRoutes";
import upvoteRoutes from "./routes/upvoteRoutes";
import statisticsRoutes from "./routes/statisticsRoutes";
import cors from "cors";
import { asyncHandler } from "./middlewares/asyncHandler";

//Load environment variable
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware to parse Incoming JSON
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// Allow requests from your frontend
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // if you're sending cookies or authorization headers
  })
);
// Routes
app.use("/api/complaints", complaintRoutes); // Complaint
app.use("/api/user", userRoutes); // User
app.use("/api/media", mediaRoutes); // Media
app.use("/api/upvote", upvoteRoutes); // Upvote
app.use("/api/statistics", statisticsRoutes); //Statistics

// app.use("/api/upload", uploadRoutes); // Upload  Routes

app.get("/", async (req, res) => {
  res.json(apiRoutes);
});

app.listen(PORT, () =>
  console.log(`Server is running on Port ${process.env.PORT}`)
);
