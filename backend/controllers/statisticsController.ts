import {
  PrismaClient,
  complaint_status,
  complaint_category,
} from "@prisma/client";
import { Request, Response } from "express";
import { asyncHandler, CustomError } from "../middlewares/asyncHandler";
import bigInt from "big-integer";
import { differenceInHours } from "date-fns";

const prisma = new PrismaClient();

// Complaint Count per Category
export const getComplaintCountPerCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await prisma.complaint.groupBy({
      by: ["category"],
      _count: true,
    });

    res.json(result);
  }
);

// Complaint Count per Status
export const getComplaintCountPerStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await prisma.complaint.groupBy({
      by: ["status"],
      _count: true,
    });

    res.json(result);
  }
);

// Most Upvoted Complaints
export const getMostUpvotedComplaints = asyncHandler(
  async (req: Request, res: Response) => {
    const complaints = await prisma.complaint.findMany({
      include: {
        upvoted_complaint: true,
      },
    });

    const sorted = complaints
      .map((c) => {
        return {
          complaint_id: bigInt(c.complaint_id).toString(),
          citizen_id: bigInt(c.citizen_id).toString(),
          authority_id: c.authority_id
            ? bigInt(c.authority_id).toString()
            : null,
          title: c.title,
          description: c.description,
          status: c.status,
          category: c.category,
          media_url: c.media_url,
          latitude: c.latitude,
          longitude: c.longitude,
          created_at: c.created_at,
          updated_at: c.updated_at,
          upvotes: c.upvoted_complaint.length,
          upvoted_complaint: c.upvoted_complaint.map((u) => ({
            upvote_id: bigInt(u.upvote_id).toString(),
            citizen_id: bigInt(u.citizen_id).toString(),
            complaint_id: bigInt(u.complaint_id).toString(),
            upvoted_at: u.upvoted_at,
          })),
        };
      })
      .sort((a, b) => b.upvotes - a.upvotes);

    res.json(sorted.slice(0, 10));
  }
);

// Recently Created Complaints
export const getRecentComplaints = asyncHandler(
  async (req: Request, res: Response) => {
    const recent = await prisma.complaint.findMany({
      orderBy: {
        created_at: "desc",
      },
      take: 10,
    });

    res.json(
      recent.map((c) => ({
        ...c,
        complaint_id: bigInt(c.complaint_id),
        citizen_id: bigInt(c.citizen_id),
        authority_id: c.authority_id ? bigInt(c.authority_id) : null,
      }))
    );
  }
);

// Average Resolution Time (Pending → Resolved)
export const getAverageResolutionTime = asyncHandler(
  async (req: Request, res: Response) => {
    const resolved = await prisma.complaint.findMany({
      where: {
        status: "Resolved",
      },
      select: {
        created_at: true,
        updated_at: true,
      },
    });

    if (resolved.length === 0) {
      throw new CustomError(
        "No resolved complaints to calculate average time.",
        404
      );
    }

    const totalHours = resolved.reduce((acc, comp) => {
      return (
        acc +
        differenceInHours(
          new Date(comp.updated_at!),
          new Date(comp.created_at!)
        )
      );
    }, 0);

    const avgHours = totalHours / resolved.length;

    res.json({
      message: "Average resolution time (in days)",
      average_days: (avgHours / 24).toFixed(2),
    });
  }
);

// Search Complaints by Title/Description
export const searchComplaints = asyncHandler(
  async (req: Request, res: Response) => {
    const searchTerm = req.query.query as string;

    if (!searchTerm) {
      throw new CustomError("Search query is required!", 400);
    }

    const results = await prisma.complaint.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    if (!results.length) {
      return res.status(404).json({ message: "No complaints found." });
    }

    res.json(
      results.map((c) => ({
        complaint_id: bigInt(c.complaint_id).toString(),
        citizen_id: bigInt(c.citizen_id).toString(),
        authority_id: c.authority_id ? bigInt(c.authority_id).toString() : null,
        title: c.title,
        description: c.description,
        status: c.status,
        category: c.category,
        media_url: c.media_url,
        created_at: c.created_at,
        updated_at: c.updated_at,
      }))
    );
  }
);
