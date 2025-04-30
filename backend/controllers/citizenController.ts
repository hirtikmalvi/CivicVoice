import bigInt, { BigInteger } from "big-integer";
import { Request, Response } from "express";
import { asyncHandler, CustomError } from "../middlewares/asyncHandler";
import prisma from "../utils/prismaClient";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import { users_role } from "@prisma/client";
import { CitizenRegisterRequest } from "../types/userTypes";
import { isValidCitizen, isValidCitizenUpdate } from "../utils/validations";

export const registerCitizen = asyncHandler(
  async (req: Request, res: Response) => {
    await isValidCitizen(req.body as CitizenRegisterRequest);

    const { fullname, email, password, role_based_data } =
      req.body as CitizenRegisterRequest;

    const hashed = await hashPassword(password);

    const user = await prisma.users.create({
      data: {
        fullname,
        email,
        password: hashed,
        role: users_role.Citizen,
      },
    });

    const citizen = await prisma.citizen.create({
      data: {
        user_id: user.user_id,
        ...role_based_data,
      },
    });

    res.status(201).json({
      success: true,
      message: "Citizen registered",
      user: { ...user, user_id: bigInt(user.user_id) },
      citizen: {
        ...citizen,
        user_id: bigInt(user.user_id),
        citizen_id: bigInt(citizen.citizen_id),
      },
    });
  }
);

//delete citizen
export const deleteCitizen = asyncHandler(async (req: any, res: Response) => {
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

  const existingCitizen = await prisma.citizen.findUnique({
    where: { user_id: userId },
  });

  if (!existingCitizen) {
    throw new CustomError("Citizen profile not found", 404);
  }

  // Delete citizen record
  await prisma.citizen.delete({ where: { user_id: userId } });

  // Delete user record
  await prisma.users.delete({ where: { user_id: userId } });

  // Clear token cookie
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Citizen profile deleted successfully",
  });
});

//get citizen profile
export const getCitizenProfile = asyncHandler(
  async (req: any, res: Response) => {
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

    const citizen = await prisma.citizen.findUnique({
      where: { user_id: userId },
    });

    if (!citizen) {
      throw new CustomError("Citizen profile not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Citizen profile fetched successfully",
      user: { ...user, user_id: bigInt(user.user_id) },
      citizen: {
        ...citizen,
        user_id: bigInt(citizen.user_id),
        citizen_id: bigInt(citizen.citizen_id),
      },
    });
  }
);

// Get Citizen By Id
export const getCitizenById = asyncHandler(
  async (req: Request, res: Response) => {
    const citizen_id = req.params.citizen_id;

    if (!citizen_id) {
      throw new CustomError("Citizen ID is required", 400);
    }

    const citizen = await prisma.citizen.findUnique({
      where: { citizen_id: BigInt(citizen_id) },
      include: {
        users: true,
      },
    });

    if (!citizen) {
      throw new CustomError("Citizen not found", 404);
    }

    res.status(200).json({
      message: "Citizen fetched successfully",
      citizen: {
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
        fullname: citizen.users.fullname,
        email: citizen.users.email,
        role: citizen.users.role,
        user_created_at: citizen.users.created_at,
        user_updated_at: citizen.users.updated_at,
      },
      // users: {...citizen.users, user_id: bigInt(citizen.users.user_id)}
    });
  }
);

// Get Citizen from user_id.
export const getCitizenByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.user_id;

    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }

    const citizen = await prisma.citizen.findUnique({
      where: {
        user_id: BigInt(userId),
      },
      include: {
        users: true,
      },
    });

    if (!citizen) {
      throw new CustomError("Citizen not found for given user ID", 404);
    }

    res.status(200).json({
      message: "Citizen fetched successfully",
      citizen: {
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
        fullname: citizen.users.fullname,
        email: citizen.users.email,
        role: citizen.users.role,
        user_created_at: citizen.users.created_at,
        user_updated_at: citizen.users.updated_at,
      },
    });
  }
);

//update citizen

export const updateCitizenProfile = asyncHandler(
  async (req: any, res: Response) => {
    const userId = req.user?.user_id;

    if (!userId) {
      throw new CustomError("Unauthorized access", 401);
    }

    await isValidCitizenUpdate(
      userId,
      req.body as Partial<CitizenRegisterRequest>
    );

    const { fullname, email, role_based_data } =
      req.body as Partial<CitizenRegisterRequest>;

    const existingUser = await prisma.users.findUnique({
      where: { user_id: userId },
    });
    if (!existingUser) throw new CustomError("User not found", 404);

    const existingCitizen = await prisma.citizen.findUnique({
      where: { user_id: userId },
    });
    if (!existingCitizen)
      throw new CustomError("Citizen profile not found", 404);

    // Update base user fields
    const updatedUser = await prisma.users.update({
      where: { user_id: userId },
      data: {
        ...(fullname && { fullname }),
        ...(email && { email }),
      },
    });

    // Update citizen fields
    const updatedCitizen = await prisma.citizen.update({
      where: { user_id: userId },
      data: {
        ...(role_based_data?.adhar_number && {
          adhar_number: role_based_data.adhar_number,
        }),
        ...(role_based_data?.phone_number && {
          phone_number: role_based_data.phone_number,
        }),
        ...(role_based_data?.city && { city: role_based_data.city }),
        ...(role_based_data?.state && { state: role_based_data.state }),
        ...(role_based_data?.address && { address: role_based_data.address }),
        ...(role_based_data?.pincode && { pincode: role_based_data.pincode }),
        ...(role_based_data?.latitude && {
          latitude: role_based_data.latitude,
        }),
        ...(role_based_data?.longitude && {
          longitude: role_based_data.longitude,
        }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Citizen profile updated successfully",
      user: { ...updatedUser, user_id: bigInt(updatedUser.user_id) },
      citizen: {
        ...updatedCitizen,
        citizen_id: bigInt(updatedCitizen.citizen_id),
        user_id: bigInt(updatedCitizen.user_id),
      },
    });
  }
);


//helper function to get citizen_id by user_id

export const getCitizenIdByUserId = async (userId: string): Promise<BigInteger> => {
  const citizen = await prisma.citizen.findUnique({
    where: {
      user_id: BigInt(userId),
    },
    select: {
      citizen_id: true,
    },
  });

  if (!citizen) {
    throw new CustomError('Citizen not found for the given user_id', 404);
  }

  return bigInt(citizen.citizen_id);
};


