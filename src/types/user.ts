import { Document } from "mongoose";
import { SubAdminStatus, UserRole } from "../constants/roles";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
    password: string;
    profile?: string;
    role: UserRole;
    status?: SubAdminStatus | null;
    otpCode?: string;
    otpExpiresAt?: Date | null;
    isDeleted: boolean;
    deletedAt: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}
