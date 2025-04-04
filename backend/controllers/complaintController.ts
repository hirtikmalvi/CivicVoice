import {
  complaint_category,
  complaint_status,
  PrismaClient,
} from "@prisma/client";
import { asyncHandler, CustomError } from "../middlewares/asyncHandler";
import bigInt from "big-integer";
import { Request, Response } from "express";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import {
  generateDescriptionFromContext,
  generateTitleFromContext,
} from "../utils/complaintHelpter";
import { transcribeAudio } from "../utils/transcribeHelper";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export const getComplaints = asyncHandler(async (req, res) => {
  const allComplaints = await prisma.complaint.findMany();

  if (!allComplaints) {
    throw new CustomError("Complaints Not Found", 404);
  }
  return res.json(
    allComplaints.map((complaint) => ({
      ...complaint,
      complaint_id: bigInt(complaint.complaint_id),
      authority_id: bigInt(complaint.authority_id),
      citizen_id: bigInt(complaint.citizen_id),
    }))
  );
});

export const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await prisma.complaint.findUnique({
    where: {
      complaint_id: parseInt(req.params.complaintId),
    },
  });
  if (!complaint) {
    throw new CustomError(
      `Complaint with complaintId: ${req.params.complaintId} Not Found`,
      404
    );
  }
  return res.json({
    ...complaint,
    complaint_id: bigInt(complaint.complaint_id),
    authority_id: bigInt(complaint.authority_id),
    citizen_id: bigInt(complaint.citizen_id),
  });
});

export const getComplaintsByCitizen = asyncHandler(async (req, res) => {
  const complaintsByCitizen = await prisma.complaint.findMany({
    where: {
      citizen_id: parseInt(req.params.citizenId),
    },
  });
  if (!complaintsByCitizen.length) {
    throw new CustomError(
      `No Complaints Found For CitizenId: ${req.params.citizenId}`,
      404
    );
  }
  return res.json(
    complaintsByCitizen.map((complaint) => ({
      ...complaint,
      complaint_id: bigInt(complaint.complaint_id),
      authority_id: bigInt(complaint.authority_id),
      citizen_id: bigInt(complaint.citizen_id),
    }))
  );
});

export const getComplaintsByCategory = asyncHandler(async (req, res) => {
  if (!Object.keys(complaint_category).includes(req.params.categoryName)) {
    throw new CustomError(
      `Invalid Category Name: ${req.params.categoryName}`,
      400
    );
  }
  const complaintsByCategory = await prisma.complaint.findMany({
    where: {
      category: <complaint_category>req.params.categoryName,
    },
  });
  if (!complaintsByCategory.length) {
    throw new CustomError(
      `No Complaints Found For Category: ${req.params.categoryName}`,
      404
    );
  }
  return res.json(
    complaintsByCategory.map((complaint) => ({
      ...complaint,
      complaint_id: bigInt(complaint.complaint_id),
      authority_id: bigInt(complaint.authority_id),
      citizen_id: bigInt(complaint.citizen_id),
    }))
  );
});

export const getComplaintsByStatus = asyncHandler(async (req, res) => {
  if (!Object.keys(complaint_status).includes(req.params.statusName)) {
    throw new CustomError(`Invalid Status Name: ${req.params.statusName}`, 400);
  }
  const complaintsByStatus = await prisma.complaint.findMany({
    where: {
      status: <complaint_status>req.params.statusName,
    },
  });
  if (!complaintsByStatus.length) {
    throw new CustomError(
      `No Complaints Found For Status: ${req.params.statusName}`,
      404
    );
  }
  return res.json(
    complaintsByStatus.map((complaint) => ({
      ...complaint,
      complaint_id: bigInt(complaint.complaint_id),
      authority_id: bigInt(complaint.authority_id),
      citizen_id: bigInt(complaint.citizen_id),
    }))
  );
});

export const getComplaintMedia = asyncHandler(async (req, res) => {
  const complaintMedia = await prisma.complaint_media.findMany({
    where: {
      complaint_id: parseInt(req.params.complaintId),
    },
  });
  if (!complaintMedia.length) {
    throw new CustomError(
      `No Complaint Media Found For complaintId: ${req.params.complaintId}`,
      404
    );
  }
  return res.json(
    complaintMedia.map((media) => ({
      ...media,
      complaint_id: bigInt(media.complaint_id),
      media_id: bigInt(media.media_id),
    }))
  );
});

export const getComplaintsByAuthority = asyncHandler(async (req, res) => {
  const complaintsByAuthoriry = await prisma.complaint.findMany({
    where: {
      authority_id: parseInt(req.params.authorityId),
    },
  });
  if (!complaintsByAuthoriry.length) {
    throw new CustomError(
      `No Complaints Found For AuthoriryId: ${req.params.authorityId}`,
      404
    );
  }
  return res.json(
    complaintsByAuthoriry.map((complaint) => ({
      ...complaint,
      complaint_id: bigInt(complaint.complaint_id),
      authority_id: bigInt(complaint.authority_id),
      citizen_id: bigInt(complaint.citizen_id),
    }))
  );
});

// New complaint
export const createComplaint = asyncHandler(
  async (req: Request, res: Response) => {
    const { citizen_id, keywords, title } = req.body;
    let complaintText = keywords || "";

    // If audio is uploaded, transcribe it
    if (req.file && req.file.mimetype.startsWith("audio")) {
      const transcribedText = await transcribeAudio(req.file.buffer);
      complaintText += ` ${transcribedText}`;
    }

    // Ensure there is complaint text to process
    if (!complaintText) {
      throw new CustomError("No keywords or audio provided!", 400);
    }

    // Generate AI-based complaint description using Hugging Face
    const complaintDescription = await generateDescriptionFromContext(
      complaintText
    );

    // Generate AI-based title using Hugging Face if not provided
    const complaintTitle =
      title || (await generateTitleFromContext(complaintText));

    // Save complaint in database
    const complaint = await prisma.complaint.create({
      data: {
        citizen_id: BigInt(citizen_id),
        title: complaintTitle,
        description: complaintDescription,
      },
    });

    if (complaint) {
      // Handle image/video upload if exists
      let mediaUrl = null;
      if (
        req.file &&
        (req.file.mimetype.startsWith("image") ||
          req.file.mimetype.startsWith("video"))
      ) {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          req.file.mimetype,
          "complaints"
        );
        mediaUrl = uploadResult.secure_url;

        // Save media in DB
        await prisma.complaint_media.create({
          data: {
            complaint_id: complaint.complaint_id,
            media_url: mediaUrl,
            media_type: req.file.mimetype.split("/")[0],
          },
        });
      }
      // Response
      return res.status(201).json({
        message: "Complaint created successfully!",
        complaint: {
          ...complaint,
          complaint_id: bigInt(complaint.complaint_id),
          citizen_id: bigInt(complaint.citizen_id),
          mediaUrl,
        },
      });
    }
  }
);

// Upvote a complaint
export const upvoteComplaint = asyncHandler(
  async (req: Request, res: Response) => {
    const { complaintId } = req.params;
    const { citizen_id } = req.body;

    if (!citizen_id) {
      throw new CustomError("Citizen ID is required", 400);
    }

    const existingUpvote = await prisma.upvoted_complaint.findUnique({
      where: {
        complaint_id_citizen_id: {
          complaint_id: BigInt(complaintId),
          citizen_id: BigInt(citizen_id),
        },
      },
    });

    if (existingUpvote) {
      throw new CustomError("You already upvoted this complaint", 409);
    }

    const newUpvote = await prisma.upvoted_complaint.create({
      data: {
        complaint_id: BigInt(complaintId),
        citizen_id: BigInt(citizen_id),
      },
    });

    res.status(201).json({
      message: "Complaint upvoted successfully",
      upvote: newUpvote,
    });
  }
);
