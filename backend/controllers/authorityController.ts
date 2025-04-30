import { Request, Response } from "express";
import { AuthorityRegisterRequest } from "../types/userTypes";
import { hashPassword } from "../utils/hashPassword";
import prisma from "../utils/prismaClient";
import { CustomError, asyncHandler } from "../middlewares/asyncHandler";
import { users_role } from "@prisma/client";
import { isValidAuthority, isValidAuthorityUpdate } from "../utils/validations";
import bigInt, {BigInteger} from "big-integer";

export const registerAuthority = asyncHandler(async (req: Request, res: Response) => {
    await isValidAuthority(req.body as AuthorityRegisterRequest);
    
    const { fullname, email, password, role_based_data } = req.body as AuthorityRegisterRequest;

  const hashed = await hashPassword(password);

  const user = await prisma.users.create({
    data: {
      fullname,
      email,
      password: hashed,
      role: users_role.Authority,
    },
  });

  const authority = await prisma.authority.create({
    data: {
      user_id: user.user_id,
      ...role_based_data,
    },
  });

  res.status(201).json({ 
        success: true, 
        message: "Authority registered", 
        user: { ...user, user_id: bigInt(user.user_id)},
        authority: { ...authority, authority_id: bigInt(authority.authority_id), user_id: bigInt(user.user_id)}
   });
});


//delete authority
export const deleteAuthority = asyncHandler(async (req: any, res: Response) => {
  const userId = req.user?.user_id;

  if (!userId) {
    throw new CustomError("Unauthorized access", 401);
  }

  const existingUser = await prisma.users.findUnique({
    where: { user_id: userId}
  });

  if (!existingUser) {
    throw new CustomError("User profile not found", 404);
  }

  const existingAuthority = await prisma.authority.findUnique({
    where: { user_id: userId },
  });

  if (!existingAuthority) {
    throw new CustomError("Authority profile not found", 404);
  }

  // Delete authority record
  await prisma.authority.delete({ where: { user_id: userId } });

  // Delete user record
  await prisma.users.delete({ where: { user_id: userId } });

  // Clear token cookie
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Authority profile deleted successfully",
  });
});

//get authority profile

export const getAuthorityProfile = asyncHandler(async (req: any, res: Response) => {
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

  const authority = await prisma.authority.findUnique({
    where: { user_id: userId },
  });

  if (!authority) {
    throw new CustomError("Authority profile not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Authority profile fetched successfully",
    user: { ...user, user_id: bigInt(user.user_id) },
    admin: { ...authority, user_id: bigInt(authority.user_id), authority_id: bigInt(authority.authority_id) },
  });
});


// update authority

export const updateAuthorityProfile = asyncHandler(async (req: any, res: Response) => {
  const userId = req.user?.user_id;

  if (!userId) {
    throw new CustomError("Unauthorized access", 401);
  }

  // Validate authority update fields
  await isValidAuthorityUpdate(userId, req.body as Partial<AuthorityRegisterRequest>);

  const { fullname, email, role_based_data } = req.body as Partial<AuthorityRegisterRequest>;

  const existingUser = await prisma.users.findUnique({ where: { user_id: userId } });
  if (!existingUser) throw new CustomError("User not found", 404);

  const existingAuthority = await prisma.authority.findUnique({ where: { user_id: userId } });
  if (!existingAuthority) throw new CustomError("Authority profile not found", 404);

  // Update user fields
  const updatedUser = await prisma.users.update({
    where: { user_id: userId },
    data: {
      ...(fullname && { fullname }),
      ...(email && { email }),
    },
  });

  // Update authority-specific fields
  const updatedAuthority = await prisma.authority.update({
    where: { user_id: userId },
    data: {
      ...(role_based_data?.zone && { zone: role_based_data.zone }),
      ...(role_based_data?.department && { department: role_based_data.department }),
    },
  });

  res.status(200).json({
    success: true,
    message: "Authority profile updated successfully",
    user: { ...updatedUser, user_id: bigInt(updatedUser.user_id) },
    authority: {
      ...updatedAuthority,
      authority_id: bigInt(updatedAuthority.authority_id),
      user_id: bigInt(updatedAuthority.user_id),
    },
  });
});


// get department by user_id

export const getDepartmentByUserId = async (userId: string): Promise<BigInteger> => {
  const authority = await prisma.authority.findUnique({
    where: {
      user_id: BigInt(userId),
    },
    select: {
      department: true,
    },
  });

  if (!authority) {
    throw new CustomError('Authority not found for the given user_id', 404);
  }

  return bigInt(authority.department);
};


//authority by id
export const getAuthorityById = asyncHandler(
  async (req: Request, res: Response) => {
    const authorityId = req.params.authority_id;

    if (!authorityId) {
      throw new CustomError("authority ID is required", 400);
    }

    const authority = await prisma.authority.findUnique({
      where: { authority_id: BigInt(authorityId) },
      include: {
        users: true,
      },
    });

    if (!authority) {
      throw new CustomError("authority not found", 404);
    }

    res.status(200).json({
      message: "authority fetched successfully",
      authority: {
        ...authority,
        authority_id: bigInt(authority.authority_id),
        user_id: bigInt(authority.user_id),
        users: {...authority.users, user_id: bigInt(authority.users.user_id)}
      },
    });
  }
);


//get Authority by user_id
//authority by id
export const getAuthorityByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const user_id = req.params.user_id;

    if (!user_id) {
      throw new CustomError("User ID is required", 400);
    }

    const authority = await prisma.authority.findUnique({
      where: { user_id: BigInt(user_id) },
      include: {
        users: true,
      },
    });

    if (!authority) {
      throw new CustomError("authority not found", 404);
    }

    res.status(200).json({
      message: "authority fetched successfully",
      authority: {
        authority_id: bigInt(authority.authority_id),
        user_id: bigInt(authority.user_id),
        department: authority.department,
        zone: authority.zone,
        fullname: authority.users.fullname,
        email: authority.users.email,
        role: authority.users.role,
        created_at: authority.created_at,
        updated_at: authority.updated_at
      },
    });
  }
);
