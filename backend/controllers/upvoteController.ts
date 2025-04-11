import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler, CustomError } from "../middlewares/asyncHandler";
import bigInt from "big-integer";

const prisma = new PrismaClient();
// GET /api/upvotes/complaint/:complaintId
export const getUpvotesByComplaint = asyncHandler(
  async (req: Request, res: Response) => {
    const upvotes = await prisma.upvoted_complaint.findMany({
      where: { complaint_id: BigInt(req.params.complaintId) },
    });

    if (!upvotes.length) {
      throw new CustomError(
        `No upvotes found for complaint ID ${req.params.complaintId}`,
        404
      );
    }

    res.status(200).json(
      upvotes.map((u) => ({
        ...u,
        upvote_id: bigInt(u.upvote_id),
        complaint_id: bigInt(u.complaint_id),
        citizen_id: bigInt(u.citizen_id),
      }))
    );
  }
);

// GET /api/upvotes/citizen/:citizenId
export const getUpvotesByCitizen = asyncHandler(
  async (req: Request, res: Response) => {
    const upvotes = await prisma.upvoted_complaint.findMany({
      where: { citizen_id: BigInt(req.params.citizenId) },
    });

    if (!upvotes.length) {
      throw new CustomError(
        `No upvotes found for citizen ID ${req.params.citizenId}`,
        404
      );
    }

    res.status(200).json(
      upvotes.map((u) => ({
        ...u,
        upvote_id: bigInt(u.upvote_id),
        complaint_id: bigInt(u.complaint_id),
        citizen_id: bigInt(u.citizen_id),
      }))
    );
  }
);
