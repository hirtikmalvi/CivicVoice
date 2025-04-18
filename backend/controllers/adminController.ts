import { Request, Response } from "express";
import { AdminRegisterRequest } from "../types/userTypes";
import { hashPassword } from "../utils/hashPassword";
import prisma from "../utils/prismaClient";
import { CustomError, asyncHandler } from "../middlewares/asyncHandler";
import { users_role } from "@prisma/client";
import { isValidUser } from "../utils/validations";
import bigInt from "big-integer";

export const registerAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const { fullname, email, password } = req.body as AdminRegisterRequest;

    await isValidUser(fullname, email, password);

    const hashed = await hashPassword(password);

    const user = await prisma.users.create({
      data: {
        fullname,
        email,
        password: hashed,
        role: users_role.Admin,
      },
    });

    const admin = await prisma.admins.create({
      data: { user_id: user.user_id },
    });

    res.status(201).json({
      success: true,
      message: "Admin registered",
      user: { ...user, user_id: bigInt(user.user_id) },
      admin: {
        ...admin,
        user_id: bigInt(admin.user_id),
        admin_id: bigInt(admin.admin_id),
      },
    });
  }
);

//delete admin
export const deleteAdmin = asyncHandler(async (req: any, res: Response) => {
  const userId = req.user?.user_id;

  if (!userId) {
    throw new CustomError("Unauthorized access", 401);
  }

  const existingUser = await prisma.users.findUnique({
    where: { user_id: userId },
  });

  if (!existingUser) {
    throw new CustomError("User profile not found", 404);
  }

  const existingAdmin = await prisma.admins.findUnique({
    where: { user_id: userId },
  });

  if (!existingAdmin) {
    throw new CustomError("Admin profile not found", 404);
  }

  // Delete admin record
  await prisma.admins.delete({ where: { user_id: userId } });

  // Delete user record
  await prisma.users.delete({ where: { user_id: userId } });

  // Clear token cookie
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Admin profile deleted successfully",
  });
});

// get all citizens
export const getAllCitizens = asyncHandler(
  async (req: Request, res: Response) => {
    const citizens = await prisma.citizen.findMany({
      include: {
        users: true,
      },
    });

    if (!citizens || citizens.length === 0) {
      throw new CustomError("No citizens found", 404);
    }

    const formattedCitizens = citizens.map((citizen) => ({
      citizen_id: bigInt(citizen.citizen_id),
      user_id: bigInt(citizen.user_id),
      adhar_number: citizen.adhar_number,
      phone_number: citizen.phone_number,
      city: citizen.city,
      state: citizen.state,
      pincode: citizen.pincode,
      address: citizen.address,
      latitude: citizen.latitude,
      longitude: citizen.longitude,
      created_at: citizen.created_at,
      updated_at: citizen.updated_at,
      fullname: citizen.users?.fullname,
      email: citizen.users?.email,
      role: citizen.users?.role,
      user_created_at: citizen.users?.created_at,
      user_updated_at: citizen.users?.updated_at,
    }));

    res.status(200).json({
      success: true,
      count: formattedCitizens.length,
      citizens: formattedCitizens,
    });
  }
);

//get admin profile
export const getAdminProfile = asyncHandler(async (req: any, res: Response) => {
  const userId = req.user?.user_id;

  if (!userId) {
    throw new CustomError("Unauthorized access", 401);
  }

  const user = await prisma.users.findUnique({
    where: { user_id: userId },
    select: {
      user_id: true,
      fullname: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const admin = await prisma.admins.findUnique({
    where: { user_id: userId },
  });

  if (!admin) {
    throw new CustomError("Admin profile not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Admin profile fetched successfully",
    user: { ...user, user_id: bigInt(user.user_id) },
    admin: {
      ...admin,
      user_id: bigInt(admin.user_id),
      admin_id: bigInt(admin.admin_id),
    },
  });
});
