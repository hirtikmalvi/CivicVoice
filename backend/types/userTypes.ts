import { users_role, authority_zone, department_type } from "@prisma/client";

// Used for common login
export interface LoginRequest {
  email: string;
  password: string;
}

// For citizen-specific registration
export interface CitizenRegisterRequest {
  fullname: string;
  email: string;
  password: string;
  role_based_data: CitizenType;
}

// For authority-specific registration
export interface AuthorityRegisterRequest {
  fullname: string;
  email: string;
  password: string;
  role_based_data: AuthorityType;
}

// For admin registration (no role-based data required)
export interface AdminRegisterRequest {
  fullname: string;
  email: string;
  password: string;
}

export type CitizenType = {
  adhar_number: string;
  phone_number: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  latitude: number;
  longitude: number;
};

export type AuthorityType = {
  zone: authority_zone;
  department: department_type;
};
