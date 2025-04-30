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

// get all authorities
export const getAllAuthorities = asyncHandler(
  async (req: Request, res: Response) => {
    const authorities = await prisma.authority.findMany({
      include: {
        users: true,
      },
    });

    if (!authorities || authorities.length === 0) {
      throw new CustomError("No authorities found", 404);
    }

    const formattedAuthorities = authorities.map((authority) => ({
      authority_id: bigInt(authority.authority_id),
      user_id: bigInt(authority.user_id),
      zone: authority.zone,
      department: authority.department,
      created_at: authority.created_at,
      updated_at: authority.updated_at,
      fullname: authority.users?.fullname,
      email: authority.users?.email,
      role: authority.users?.role,
      user_created_at: authority.users?.created_at,
      user_updated_at: authority.users?.updated_at,
    }));

    res.status(200).json({
      success: true,
      count: formattedAuthorities.length,
      authorities: formattedAuthorities,
    });
  }
);


// get all users
export const getAllUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await prisma.users.findMany({});

    if (!users || users.length === 0) {
      throw new CustomError("No citizens found", 404);
    }

    const formattedUsers = users.map((user) => ({
      user_id: bigInt(user.user_id),
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));

    res.status(200).json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers,
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


// DELETE /api/citizen/by-citizen-id/:citizen_id
export const deleteCitizenByCitizenId = asyncHandler(async (req: Request, res: Response) => {
  const { citizen_id } = req.params;

  if (!citizen_id) {
    throw new CustomError("Citizen ID is required", 400);
  }

  const citizen = await prisma.citizen.findUnique({
    where: { citizen_id: BigInt(citizen_id) },
  });

  if (!citizen) {
    throw new CustomError("Citizen not found", 404);
  }

  const user_id = citizen.user_id;

  // Delete citizen
  await prisma.citizen.delete({ where: { citizen_id: BigInt(citizen_id) } });

  // Delete user if exists
  await prisma.users.delete({ where: { user_id } });

  res.status(200).json({
    success: true,
    message: "Citizen and associated user deleted successfully",
  });
});


// DELETE /api/admin/by-user-id/:user_id
export const deleteCitizenByUserId = asyncHandler(async (req: Request, res: Response) => {
  const { user_id } = req.params;

  if (!user_id) {
    throw new CustomError("User ID is required", 400);
  }

  const citizen = await prisma.citizen.findUnique({
    where: { user_id: BigInt(user_id) },
  });

  if (!citizen) {
    throw new CustomError("Citizen not found", 404);
  }

  // Delete citizen
  await prisma.citizen.delete({ where: { user_id: BigInt(user_id) } });

  // Delete user
  await prisma.users.delete({ where: { user_id: BigInt(user_id) } });

  res.status(200).json({
    success: true,
    message: "Citizen and associated user deleted successfully",
  });
});


// DELETE /api/admin/by-authority-id/:authority_id
export const deleteAuthorityByAuthorityId = asyncHandler(async (req: Request, res: Response) => {
  const { authority_id } = req.params;

  if (!authority_id) {
    throw new CustomError("Authority ID is required", 400);
  }

  const authority = await prisma.authority.findUnique({
    where: { authority_id: BigInt(authority_id) },
  });

  if (!authority) {
    throw new CustomError("Authority not found", 404);
  }

  const user_id = authority.user_id;

  // Delete citizen
  await prisma.authority.delete({ where: { authority_id: BigInt(authority_id) } });

  // Delete user if exists
  await prisma.users.delete({ where: { user_id } });

  res.status(200).json({
    success: true,
    message: "Authority and associated user deleted successfully",
  });
});


//delete user
export const deleteUserByUserId = asyncHandler(async (req: Request, res: Response) => {
  const { user_id } = req.params;

  if (!user_id) {
    throw new CustomError("User ID is required", 400);
  }

  const user = await prisma.users.findUnique({
    where: { user_id: BigInt(user_id) },
  });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  if(user.role == "Admin") {
    const admin = await prisma.admins.findUnique({
      where: { user_id: BigInt(user_id) },
    });

    if(!admin) {
      throw new CustomError("Admin not found", 404);
    }

    await prisma.admins.delete({
      where: { admin_id: admin.admin_id }
    });
    await prisma.users.delete({
      where: { user_id: BigInt(user_id) },
    });
  }
  else if(user.role == "Citizen") {
    const citizen = await prisma.citizen.findUnique({
      where: { user_id: BigInt(user_id) },
    });

    if(!citizen) {
      throw new CustomError("Citizen not found", 404);
    }

    await prisma.citizen.delete({
      where: { citizen_id: citizen.citizen_id }
    });
    await prisma.users.delete({
      where: { user_id: BigInt(user_id) },
    });
  }
  else if(user.role == "Authority") {
    const authority = await prisma.authority.findUnique({
      where: { user_id: BigInt(user_id) },
    });

    if(!authority) {
      throw new CustomError("Authority not found", 404);
    }

    await prisma.authority.delete({
      where: { authority_id: authority.authority_id }
    });
    await prisma.users.delete({
      where: { user_id: BigInt(user_id) },
    });
  }
  else {
    throw new CustomError("No role match for deletion");
  }

  res.status(200).json({ message: `User with ID ${user_id} deleted successfully` });
});


//get Authority by user_id
//authority by id
export const getAdminByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const user_id = req.params.user_id;

    if (!user_id) {
      throw new CustomError("User ID is required", 400);
    }

    const admin = await prisma.admins.findUnique({
      where: { user_id: BigInt(user_id) },
      include: {
        users: true,
      },
    });

    if (!admin) {
      throw new CustomError("admin not found", 404);
    }

    res.status(200).json({
      message: "admin fetched successfully",
      admin: {
        admin_id: bigInt(admin.admin_id),
        user_id: bigInt(admin.user_id),
        fullname: admin.users.fullname,
        email: admin.users.email,
        role: admin.users.role,
        created_at: admin.created_at,
        updated_at: admin.updated_at,
        user_created_at: admin.users.created_at,
        user_updated_at: admin.users.updated_at
      },
    });
  }
);
