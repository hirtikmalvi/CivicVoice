// controllers/uploadController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler, CustomError } from "../middlewares/asyncHandler";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import bigInt from "big-integer";

const prisma = new PrismaClient();

interface UploadOptions {
  folder: string;
  model: "complaint_media";
  //   "complaint_media" | "user_media" | "product_media"; // Extend as needed
  foreignKey: { field: string; value: number | string | bigint };
}

export const genericUpload = (options: UploadOptions) =>
  asyncHandler(async (req: Request, res: Response) => {
    const { folder, model, foreignKey } = options;

    if (!req.file) {
      throw new CustomError("No file uploaded!", 400);
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.mimetype,
      folder
    );

    const data = {
      [foreignKey.field]: BigInt(foreignKey.value),
      media_url: result.secure_url,
      media_type: req.file.mimetype.split("/")[0],
    };

    const newMedia = await (prisma as any)[model].create({ data });

    return res.status(201).json({
      message: "File uploaded successfully!",
      media: {
        ...newMedia,
        media_id: bigInt(newMedia.media_id),
        [foreignKey.field]: bigInt(newMedia[foreignKey.field]),
      },
    });
  });
