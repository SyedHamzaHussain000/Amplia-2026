import { Request, Response } from "express";
import { User } from "../models/user";
import { createProfileUrl } from "../utils/createProfileUrl";
import mongoose from "mongoose";
import { verifyHashedPass } from "../utils/verifyHashedPass";
import { createHashedPassword } from "../utils/createHashedPassword";

export const UserController = {
    get: async (req: Request, res: Response) => {
        try {
            const _id = req._id

            const user = await User.findById(_id).select("-password -role -status -otpCode -otpExpiresAt");
            if (!user) return res.status(404).json({ message: "User not found", success: false });

            res.status(200).json({
                message: "User details fetched successfully", success: true, user
            });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const _id = req._id
            const { firstName, lastName, companyName } = req.body

            const updates: Record<string, any> = {};

            const profileUrl = createProfileUrl(req);
            if (req.body.profile !== undefined || req.file) {
                updates.profile = profileUrl;
            }
            if (firstName) updates.firstName = firstName;
            if (lastName) updates.lastName = lastName;
            if (companyName) updates.companyName = companyName;

            const updatedUser = await User.findByIdAndUpdate(
                _id,
                { $set: updates },
                { new: true, runValidators: true }
            ).select("-password -role -status -otpCode -otpExpiresAt");

            if (!updatedUser) return res.status(404).json({ message: "User not found", success: false });

            res.status(200).json({
                message: "User updated successfully", success: true, user: updatedUser
            });

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const _id = req._id
            const user = await User.collection.findOne({ _id: new mongoose.Types.ObjectId(_id) });

            if (!user) return res.status(404).json({ message: "User not found", success: false });

            if (user.isDeleted) return res.status(400).json({ message: "User is already deleted", success: false });

            await User.findByIdAndUpdate(_id, { isDeleted: true, deletedAt: new Date() });

            res.status(200).json({ message: "User deleted successfully", success: true });

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    updatePassword: async (req: Request, res: Response) => {
        try {
            const _id = req._id
            const { currentPassword, newPassword } = req.body;

            const user = await User.findById(_id);
            if (!user) return res.status(404).json({ message: "User not found", success: false });

            const isPasswordVerified = await verifyHashedPass(currentPassword, user.password);
            if (!isPasswordVerified) return res.status(400).json({ success: false, message: "Current password is incorrect" });

            const hashedPassword = await createHashedPassword(newPassword)
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ message: "Password updated successfully", success: true });

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
}