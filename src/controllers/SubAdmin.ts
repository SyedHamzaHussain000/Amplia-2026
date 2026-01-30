import { Request, Response } from "express";
import { User } from "../models/user";
import { toLowerEmail } from "../utils/toLowerEmail";
import { createProfileUrl } from "../utils/createProfileUrl";
import { createHashedPassword } from "../utils/createHashedPassword";
import { UserRole } from "../constants/roles";

export const SubAdminController = {
    createSubAdmin: async (req: Request, res: Response) => {
        try {
            console.log(`[SubAdmin Controller] createSubAdmin hit`);
            console.log(`[SubAdmin Controller] Body:`, JSON.stringify(req.body, null, 2));
            console.log(`[SubAdmin Controller] File:`, req.file ? `File present: ${req.file.fieldname}` : "No file present");
            const { firstName, email, password, status, role } = req.body;
            const lowerEmail = toLowerEmail(email)

            const exists = await User.collection.findOne({ email: lowerEmail });
            if (exists) {
                if (exists.isDeleted) return res.status(400).json({
                    success: false,
                    message: "A sub-admin account with this email was previously deleted."
                });

                return res.status(400).json({ success: false, message: "This email is already in use." });
            }


            const profileUrl = createProfileUrl(req);

            const hashedPassword = await createHashedPassword(password)

            const subAdmin = await User.create({
                firstName, email: lowerEmail,
                password: hashedPassword, profile: profileUrl,
                role: role || UserRole.SUB_ADMIN, status
            })

            return res.status(201).json({
                success: true, message: "Sub Admin created successfully", subAdmin,
            });

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    updateSubAdmin: async (req: Request, res: Response) => {
        try {
            console.log(`[SubAdmin Controller] updateSubAdmin hit`);
            console.log(`[SubAdmin Controller] Body:`, JSON.stringify(req.body, null, 2));
            console.log(`[SubAdmin Controller] File:`, req.file ? `File present: ${req.file.fieldname}` : "No file present");
            const { id } = req.params;
            const { firstName, email, status, role } = req.body;

            const subAdmin = await User.findOne({ _id: id, role: UserRole.SUB_ADMIN });
            if (!subAdmin) return res.status(404).json({ success: false, message: "Sub Admin not found." });

            const updateData: any = {};

            if (firstName) updateData.firstName = firstName;
            if (email) updateData.email = toLowerEmail(email);
            if (status) updateData.status = status;
            if (role) updateData.role = role;

            if (req.file) {
                updateData.profile = createProfileUrl(req);
            }

            const updatedSubAdmin = await User.findByIdAndUpdate(id, updateData, { new: true });

            res.status(200).json({
                success: true, message: "Sub Admin updated successfully.", updatedSubAdmin
            });

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    deleteSubAdmin: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const subAdmin = await User.findOne({ _id: id, role: UserRole.SUB_ADMIN });

            if (!subAdmin) return res.status(404).json({ success: false, message: "Sub admin not found" });

            subAdmin.isDeleted = true;
            subAdmin.deletedAt = new Date();
            await subAdmin.save();

            return res.status(200).json({ success: true, message: "Sub admin deleted successfully" });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    getSubAdmins: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (id) {
                const subAdmin = await User.findOne({ _id: id, role: UserRole.SUB_ADMIN });
                if (!subAdmin) return res.status(404).json({ success: false, message: "Sub-admin not found." });

                return res.status(200).json({ success: true, message: "Sub-admin fetched successfully", subAdmin });
            }

            const subAdmins = await User.find({ role: UserRole.SUB_ADMIN }).sort({ createdAt: -1 });
            return res.status(200).json({
                success: true, message: "Sub-admins fetched successfully", subAdmins
            });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    }
}