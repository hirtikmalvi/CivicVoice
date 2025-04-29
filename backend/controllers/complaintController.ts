import {
  complaint,
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

// Utility function to convert BigInt values in an object to strings
function serializeBigInt(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
}

export const getTrendingComplaints = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const recentComplaints: any = await prisma.$queryRaw`
    SELECT 
      c.*,
      COUNT(uc.upvote_id) as upvote_count
    FROM 
      complaint c
    LEFT JOIN 
      upvoted_complaint uc ON c.complaint_id = uc.complaint_id
    WHERE 
      c.created_at >= ${threeDaysAgo}
    GROUP BY 
      c.complaint_id
    ORDER BY
      COUNT(uc.upvote_id) DESC,
      c.created_at DESC
  `;

  if (!recentComplaints.length) {
    throw new CustomError('No recent complaints found', 404);
  }

  const trendingComplaints = recentComplaints.map((complaint: any) => {
    const hoursSincePosting =
      (new Date().getTime() - new Date(complaint.created_at).getTime()) / (1000 * 60 * 60);

    const upvoteScore = Number(complaint.upvote_count);
    const recencyScore = Math.max(0, 72 - hoursSincePosting) / 72;

    const trendingScore = (upvoteScore * 3) + (recencyScore * 2);

    return {
      ...complaint,
      upvotes: upvoteScore,
      trendingScore
    };
  });

  const sortedComplaints = trendingComplaints.sort((a, b) =>
    b.trendingScore - a.trendingScore
  );

  const skip = (page - 1) * limit;
  const paginatedComplaints = sortedComplaints.slice(skip, skip + limit);

  const serializedResponse = serializeBigInt({
    trending: paginatedComplaints,
    total: sortedComplaints.length,
    page: page,
    limit: limit,
    totalPages: Math.ceil(sortedComplaints.length / limit)
  });

  return res.json(serializedResponse);
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

export const getAllComplaintsUpvotedByCitizen = asyncHandler(
  async (req, res) => {
    const complaintsUpvotedByCitizen = await prisma.upvoted_complaint.findMany({
      where: {
        citizen_id: parseInt(req.params.citizenId),
      },
    });

    if (!complaintsUpvotedByCitizen.length) {
      throw new CustomError(
        `No Complaints are upvoted by citizen_id: ${req.params.citizenId}`,
        404
      );
    }
    return res.json(
      complaintsUpvotedByCitizen.map((complaint) => ({
        ...complaint,
        complaint_id: bigInt(complaint.complaint_id),
        citizen_id: bigInt(complaint.citizen_id),
        upvote_id: bigInt(complaint.upvote_id),
      }))
    );
  }
);

export const getUpvoteCountOfComplaint = asyncHandler(async (req, res) => {
  const upvoteCount = await prisma.upvoted_complaint.count({
    where: {
      complaint_id: parseInt(req.params.complaintId),
    },
  });

  return res.json({
    count: upvoteCount,
  });
});

// New complaint
export const createComplaint = asyncHandler(
  async (req: Request, res: Response) => {
    const { citizen_id, category, location, latitude, longitude } = req.body;
    let { title, description } = req.body;

    // Access other form data
    const files = req.files as Express.Multer.File[];

    if (files && files.length > 5) {
      throw new CustomError("You can upload a maximum of 5 files.", 400);
    }

    let audioFile: Express.Multer.File | undefined;
    const mediaFiles: Express.Multer.File[] = [];

    // Separate audio and image/video files
    if (files) {
      for (const file of files) {
        if (file.mimetype.startsWith("audio") && !audioFile) {
          audioFile = file;
        } else if (
          file.mimetype.startsWith("image") ||
          file.mimetype.startsWith("video")
        ) {
          mediaFiles.push(file);
        }
      }
    }

    // Ensure citizen_id is present
    if (!citizen_id) {
      throw new CustomError("Citizen ID is required.", 400);
    }

    // Convert location string to JSON object
    let locationObject;
    try {
      locationObject = location ? JSON.parse(location) : null;
    } catch (error) {
      throw new CustomError(
        "Invalid location format. Must be a JSON string.",
        400
      );
    }

    // Initialize complaintText with the provided description if available
    let complaintText = description || "";

    // Transcribe audio if present
    if (audioFile) {
      const transcribedText = await transcribeAudio(
        audioFile.buffer,
        audioFile.mimetype
      );
      complaintText += ` ${transcribedText}`;
    }

    // Ensure complaint text is present
    if (!complaintText) {
      throw new CustomError("No description or audio provided!", 400);
    }

    // Generate AI-based description and title if not provided
    if (!description) {
      description = await generateDescriptionFromContext(complaintText);
    }
    if (!title) {
      title = await generateTitleFromContext(description);
    }

    // Save complaint in DB
    const complaint = await prisma.complaint.create({
      data: {
        citizen_id: BigInt(citizen_id),
        title: title,
        description: description,
        category: category || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      },
    });

    const mediaUrls: string[] = [];

    // Upload audio if present
    if (audioFile) {
      const uploadResult = await uploadToCloudinary(
        audioFile.buffer,
        audioFile.mimetype,
        "complaints"
      );

      const audioUrl = uploadResult.secure_url;
      mediaUrls.push(audioUrl);

      await prisma.complaint_media.create({
        data: {
          complaint_id: complaint.complaint_id,
          media_url: uploadResult.secure_url,
          media_type: "audio", // Using "video" instead of "audio" to pass the constraint
        },
      });
    }

    // Upload all image/video files to Cloudinary & store in DB
    if (mediaFiles.length > 0) {
      for (const mediaFile of mediaFiles) {
        const uploadResult = await uploadToCloudinary(
          mediaFile.buffer,
          mediaFile.mimetype,
          "complaints"
        );

        mediaUrls.push(uploadResult.secure_url);

        let mediaType = mediaFile.mimetype.startsWith("image")
          ? "image"
          : "video";

        await prisma.complaint_media.create({
          data: {
            complaint_id: complaint.complaint_id,
            media_url: uploadResult.secure_url,
            media_type: mediaType,
          },
        });
      }
    }

    // Response
    return res.status(201).json({
      message: "Complaint created successfully!",
      complaint: {
        ...complaint,
        complaint_id: bigInt(complaint.complaint_id),
        citizen_id: bigInt(complaint.citizen_id),
        mediaUrls,
      },
    });
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
      upvote: {
        ...newUpvote,
        upvote_id: bigInt(newUpvote.upvote_id),
        complaint_id: bigInt(newUpvote.complaint_id),
        citizen_id: bigInt(newUpvote.citizen_id),
      },
    });
  }
);

// Delete a complaint
export const deleteComplaint = asyncHandler(
  async (req: Request, res: Response) => {
    const complaintId = BigInt(req.params.complaintId);

    const existing = await prisma.complaint.findUnique({
      where: { complaint_id: complaintId },
    });

    if (!existing) throw new CustomError("Complaint not found", 404);

    await prisma.complaint.delete({
      where: { complaint_id: complaintId },
    });

    res.status(200).json({ message: "Complaint deleted successfully" });
  }
);

// Delete media from a complaint
export const deleteMediaFromComplaint = asyncHandler(
  async (req: Request, res: Response) => {
    const complaintId = BigInt(req.params.complaintId);
    const mediaId = BigInt(req.params.mediaId);

    const media = await prisma.complaint_media.findUnique({
      where: { media_id: mediaId },
    });

    if (!media || media.complaint_id !== complaintId) {
      throw new CustomError("Media not found for this complaint", 404);
    }

    await prisma.complaint_media.delete({
      where: { media_id: mediaId },
    });

    res.status(200).json({ message: "Media deleted successfully" });
  }
);

// Remove upvote from a complaint
export const removeUpvoteFromComplaint = asyncHandler(
  async (req: Request, res: Response) => {
    const complaintId = BigInt(req.params.complaintId);
    const citizenId = BigInt(req.params.citizenId);

    const upvote = await prisma.upvoted_complaint.findUnique({
      where: {
        complaint_id_citizen_id: {
          complaint_id: complaintId,
          citizen_id: citizenId,
        },
      },
    });

    if (!upvote) {
      throw new CustomError("Upvote not found", 404);
    }

    await prisma.upvoted_complaint.delete({
      where: {
        complaint_id_citizen_id: {
          complaint_id: complaintId,
          citizen_id: citizenId,
        },
      },
    });

    res.status(200).json({ message: "Upvote removed successfully" });
  }
);

// Update full complaint
export const updateComplaint = asyncHandler(
  async (req: Request, res: Response) => {
    const { complaintId } = req.params;

    const updated = await prisma.complaint.update({
      where: { complaint_id: BigInt(complaintId) },
      data: req.body, // contains full/partial fields
    });

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint: {
        ...updated,
        complaint_id: bigInt(updated.complaint_id),
        citizen_id: bigInt(updated.citizen_id),
        authority_id: bigInt(updated.authority_id),
      },
    });
  }
);

// Update status only
export const updateComplaintStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { complaintId } = req.params;
    const { status } = req.body;

    if (!status) throw new CustomError("Status is required", 400);

    const updated = await prisma.complaint.update({
      where: { complaint_id: BigInt(complaintId) },
      data: { status },
    });

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      complaint: {
        ...updated,
        complaint_id: bigInt(updated.complaint_id),
        citizen_id: bigInt(updated.citizen_id),
        authority_id: bigInt(updated.authority_id),
      },
    });
  }
);

// Update category only
export const updateComplaintCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { complaintId } = req.params;
    const { category } = req.body;

    if (!category) throw new CustomError("Category ID is required", 400);

    const updated = await prisma.complaint.update({
      where: { complaint_id: BigInt(complaintId) },
      data: { category },
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      complaint: {
        ...updated,
        complaint_id: bigInt(updated.complaint_id),
        citizen_id: bigInt(updated.citizen_id),
        authority_id: bigInt(updated.authority_id),
      },
    });
  }
);

// Update authority only
export const updateComplaintAuthority = asyncHandler(
  async (req: Request, res: Response) => {
    const { complaintId } = req.params;
    const { authority_id } = req.body;

    if (!authority_id) throw new CustomError("Authority ID is required", 400);

    const updated = await prisma.complaint.update({
      where: { complaint_id: +complaintId },
      data: { authority_id: BigInt(authority_id) },
    });

    res.status(200).json({
      success: true,
      message: "Authority reassigned successfully",
      complaint: {
        ...updated,
        complaint_id: bigInt(updated.complaint_id),
        citizen_id: bigInt(updated.citizen_id),
        authority_id: bigInt(updated.authority_id),
      },
    });
  }
);

// Trending
export const getTrendingComplaints = asyncHandler(
  async (req: Request, res: Response) => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago

    const recentComplaints = await prisma.complaint.findMany({
      where: {
        created_at: {
          gte: oneDayAgo,
          lte: now,
        },
      },
      include: {
        citizen: {
          include: {
            users: true,
          },
        },
        _count: {
          select: {
            upvoted_complaint: true,
          },
        },
      },
    });

    if (recentComplaints.length === 0) {
      return res.status(200).json([]);
    }

    const totalUpvotes = recentComplaints.reduce(
      (sum, c) => sum + c._count.upvoted_complaint,
      0
    );
    const averageUpvotes = totalUpvotes / recentComplaints.length;
    const trending = recentComplaints
      .filter((c) => c._count.upvoted_complaint)
      .map((c) => ({
        complaint_id: Number(c.complaint_id),
        title: c.title,
        status: c.status,
        upvotes: c._count.upvoted_complaint,
        citizen_name: c.citizen?.users?.fullname || "Unknown",
        created_at: c.created_at,
        citizen_id: Number(c.citizen_id),
      }));

    return res.status(200).json(trending);
  }
);
