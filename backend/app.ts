import express, { json } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import complaintRoutes from "./routes/complaintRoutes";
import { apiRoutes } from "./endpoints_info/data";
import mediaRoutes from "./routes/mediaRoutes";
import upvoteRoutes from "./routes/upvoteRoutes";
import statisticsRoutes from "./routes/statisticsRoutes";
import cors from "cors";
import citizenRoutes from "./routes/citizenRoutes";
import adminRoutes from "./routes/adminRoutes";
import authorityRoutes from "./routes/authorityRoutes";
import categoryRoutes from "./routes/categoryRoutes";

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
    origin: "https://civic-voice-six.vercel.app",
    credentials: true, // if you're sending cookies or authorization headers
  })
);
// Routes
app.use("/api/complaints", complaintRoutes); // Complaint
app.use("/api/media", mediaRoutes); // Media
app.use("/api/upvote", upvoteRoutes); // Upvote
app.use("/api/statistics", statisticsRoutes); //Statistics
app.use("/api/complaints", complaintRoutes);
app.use("/api/citizen", citizenRoutes);
app.use("/api/authority", authorityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/category", categoryRoutes);

// app.use("/api/upload", uploadRoutes); // Upload  Routes

app.get("/", async (req, res) => {
  res.json(apiRoutes);
});

app.listen(PORT, () =>
  console.log(`Server is running on Port ${process.env.PORT}`)
);
