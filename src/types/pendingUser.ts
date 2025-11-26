import { Document } from "mongoose";

export interface IPendingUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
    password: string;
    profile?: string;
    otpCode?: string;
    otpExpiresAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}
