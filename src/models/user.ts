import mongoose, { Query, Schema } from "mongoose";
import { IUser } from "../types";
import { SubAdminStatus, UserRole } from "../constants/roles";

const UserSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    companyName: { type: String, default: "" },
    password: { type: String, required: true },
    profile: { type: String, default: "" },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    status: { type: String, enum: Object.values(SubAdminStatus), default: null },
    otpCode: { type: String, default: "" },
    otpExpiresAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });

UserSchema.pre<Query<IUser & { isDeleted: boolean; deletedAt?: Date }, IUser>>(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});


export const User = mongoose.model<IUser>("User", UserSchema);