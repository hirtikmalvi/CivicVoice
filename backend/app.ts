import express, { json } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import complaintRoutes from "./routes/complaintRoutes";
import { apiRoutes } from "./endpoints_info/data";
import userRoutes from "./routes/userRoutes";
import { asyncHandler } from "./middlewares/asyncHandler";


//Load environment variable
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware to parse Incoming JSON
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/complaints", complaintRoutes); 
app.use("/api/user", userRoutes);

// app.use("/api/upload", uploadRoutes); // Upload  Routes

app.get("/", async (req, res) => {
  res.json(apiRoutes);
});

app.listen(5000, () => console.log(`Server is running on Port ${process.env.PORT}`));
