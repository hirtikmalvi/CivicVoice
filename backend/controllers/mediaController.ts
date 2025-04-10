import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler, CustomError } from "../middlewares/asyncHandler";
import bigInt from "big-integer";

const prisma = new PrismaClient();

// GET /api/media/:mediaId
export const getMediaById = asyncHandler(
  async (req: Request, res: Response) => {
    const media = await prisma.complaint_media.findUnique({
      where: { media_id: BigInt(req.params.mediaId) },
    });

    if (!media) {
      throw new CustomError(
        `Media with ID ${req.params.mediaId} not found.`,
        404
      );
    }

    res.status(200).json({
      ...media,
      media_id: bigInt(media.media_id),
      complaint_id: bigInt(media.complaint_id),
    });
  }
);

// GET /api/media/type/:mediaType
export const getMediaByType = asyncHandler(
  async (req: Request, res: Response) => {
    const type = req.params.mediaType.toLowerCase();

    const media = await prisma.complaint_media.findMany({
      where: { media_type: type },
    });

    if (!media.length) {
      throw new CustomError(`No media found of type '${type}'.`, 404);
    }

    res.status(200).json(
      media.map((m) => ({
        ...m,
        media_id: bigInt(m.media_id),
        complaint_id: bigInt(m.complaint_id),
      }))
    );
  }
);

// PUT /api/media/:mediaId
export const updateMedia = asyncHandler(async (req: Request, res: Response) => {
  const { media_url, media_type } = req.body;

  try {
    const updated = await prisma.complaint_media.update({
      where: { media_id: BigInt(req.params.mediaId) },
      data: { media_url, media_type },
    });

    res.status(200).json({
      message: "Media updated successfully",
      media: {
        ...updated,
        media_id: bigInt(updated.media_id),
        complaint_id: bigInt(updated.complaint_id),
      },
    });
  } catch (err) {
    throw new CustomError(
      `Media with ID ${req.params.mediaId} not found.`,
      404
    );
  }
});

// PATCH /api/media/:mediaId/type
export const updateMediaType = asyncHandler(
  async (req: Request, res: Response) => {
    const { media_type } = req.body;

    try {
      const updated = await prisma.complaint_media.update({
        where: { media_id: BigInt(req.params.mediaId) },
        data: { media_type },
      });

      res.status(200).json({
        message: "Media type updated",
        media: {
          ...updated,
          media_id: bigInt(updated.media_id),
          complaint_id: bigInt(updated.complaint_id),
        },
      });
    } catch (err) {
      throw new CustomError(
        `Media with ID ${req.params.mediaId} not found.`,
        404
      );
    }
  }
);

// DELETE /api/media/:mediaId
export const deleteMedia = asyncHandler(async (req: Request, res: Response) => {
  try {
    await prisma.complaint_media.delete({
      where: { media_id: BigInt(req.params.mediaId) },
    });

    res.status(200).json({ message: "Media deleted successfully" });
  } catch (err) {
    throw new CustomError(
      `Media with ID ${req.params.mediaId} not found.`,
      404
    );
  }
});
