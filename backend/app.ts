import express, { json } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import complaintRoutes from "./routes/complaintRoutes";
import { apiRoutes } from "./endpoints_info/data";

const app = express();
const prisma = new PrismaClient();

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/complaints", complaintRoutes); // Complaint  Routes

// app.use("/api/upload", uploadRoutes); // Upload  Routes

app.get("/", async (req, res) => {
  res.json(apiRoutes);
});

app.listen(PORT, () => console.log(`Server Started at ${PORT}`));
