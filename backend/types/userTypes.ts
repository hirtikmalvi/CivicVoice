import { users_role, authority_zone, department_type } from "@prisma/client";

export interface RegisterRequest {
    fullname: string,
    email: string,
    password: string,
    role: users_role,
    role_based_data?: CitizenType | AuthorityType //If role is admin then there may be no data
}

export type CitizenType = {
    adhar_number: string,
    phone_number: string,
    city: string,
    state: string,
    address: string,
    pincode: string,
    latitude: number,
    longitude: number  //Geolocation
}

export type AuthorityType = {
    zone: authority_zone,
    department: department_type
}

export interface LoginRequest {
    email: string,
    password: string
}