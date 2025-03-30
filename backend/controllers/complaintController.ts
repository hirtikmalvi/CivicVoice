import {
  complaint_category,
  complaint_status,
  PrismaClient,
} from "@prisma/client";
import { asyncHandler, CustomError } from "../middlewares/asyncHandler";
import bigInt from "big-integer";

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
