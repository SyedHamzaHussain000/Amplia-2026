import mongoose, { Schema } from "mongoose";
import { IPendingUser } from "../types";

const PendingUserSchema = new Schema<IPendingUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    password: { type: String, required: true },
    profile: { type: String, default: "" },
    otpCode: { type: String, default: "" },
    otpExpiresAt: { type: Date, default: null },
}, { timestamps: true });

export const PendingUser = mongoose.model<IPendingUser>("PendingUser", PendingUserSchema);