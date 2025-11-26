import { Request, Response } from "express";
import { createOtp } from "../utils/createOtp";
import { createHashedPassword } from "../utils/createHashedPassword";
import { PendingUser } from "../models/pendingUser";
import { createProfileUrl } from "../utils/createProfileUrl";
import { toLowerEmail } from "../utils/toLowerEmail";
import { sendEmail } from "../utils/sendEmail";
import { User } from "../models/user";
import { createJWT } from "../utils/createJWT";
import { sanitizeUser } from "../utils/sanitizeUser";
import { verifyHashedPass } from "../utils/verifyHashedPass";
import { UserRole } from "../constants/roles";

export const AuthController = {
    signupRequestOtp: async (req: Request, res: Response) => {
        try {
            const { firstName, lastName, email, companyName, password } = req.body;

            const lowerEmail = toLowerEmail(email)

            const user = await User.findOne({ email: lowerEmail });
            if (user) return res.status(400).json({ success: false, message: "This email is already registered." });

            const profileUrl = createProfileUrl(req);
            const OTP = await createOtp();
            const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
            const hashedPassword = await createHashedPassword(password)

            const pendingUser = await PendingUser.findOneAndUpdate({ email: lowerEmail },
                {
                    firstName, lastName, companyName, password: hashedPassword,
                    profile: profileUrl, otpCode: OTP, otpExpiresAt,
                },
                {
                    new: true, upsert: true, setDefaultsOnInsert: true,
                }
            );

            await sendEmail({
                to: lowerEmail,
                subject: "Complete your registration",
                otp: OTP,
                name: `${firstName} ${lastName}`,
                templatePath: "../templates/completeRegistration.html",
            });

            res.status(200).json({ success: true, message: "OTP sent successfully" });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    signupVerifyOtp: async (req: Request, res: Response) => {
        try {
            const { email, otp } = req.body

            const lowerEmail = toLowerEmail(email);

            const user = await User.findOne({ email: lowerEmail });
            if (user) return res.status(400).json({ success: false, message: "This email is already registered." });

            const existingPendingUser = await PendingUser.findOne({ email: lowerEmail });
            if (!existingPendingUser) return res.status(400).json({ success: false, message: "No account found. Please start the signup process again." });

            if (!existingPendingUser.otpCode) return res.status(400).json({ success: false, message: "OTP not generated. Please request a new one." });

            const inputOtp = String(otp).trim();
            const savedOtp = String(existingPendingUser.otpCode).trim();
            if (inputOtp !== savedOtp) return res.status(400).json({ success: false, message: "Invalid OTP. Please enter the correct code." });


            if (!existingPendingUser.otpExpiresAt || existingPendingUser.otpExpiresAt < new Date()) {
                return res.status(400).json({
                    success: false, message: "OTP expired. Please request a new one.",
                });
            }

            const newUser = await User.create({
                firstName: existingPendingUser.firstName, lastName: existingPendingUser.lastName,
                email: existingPendingUser.email, companyName: existingPendingUser.companyName,
                password: existingPendingUser.password, profile: existingPendingUser.profile,
                role: UserRole.USER
            })
            await existingPendingUser.deleteOne({ _id: existingPendingUser._id });

            const payload = {
                _id: newUser._id.toString(),
                email: newUser.email,
                role: newUser.role
            };

            const token = await createJWT(payload);
            const cleanUser = sanitizeUser(newUser)
            return res.status(200).json({ success: true, message: "OTP verified! signup successfully.", user: cleanUser, token });

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    signupResendOtp: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const lowerEmail = toLowerEmail(email);

            const user = await User.findOne({ email: lowerEmail });
            if (user) return res.status(400).json({ success: false, message: "This email is already registered." });

            const pendingUser = await PendingUser.findOne({ email: lowerEmail });
            if (!pendingUser) return res.status(404).json({ success: false, message: "No account found. Please start the signup process again." });


            const OTP = await createOtp();
            const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

            pendingUser.otpCode = OTP;
            pendingUser.otpExpiresAt = otpExpiresAt;
            await pendingUser.save();

            await sendEmail({
                to: lowerEmail,
                subject: "Complete your registration",
                otp: OTP,
                name: `${pendingUser.firstName} ${pendingUser.lastName}`,
                templatePath: "../templates/completeRegistration.html",
            });

            return res.status(200).json({ success: true, message: "OTP resent successfully." });

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    signin: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const lowerEmail = toLowerEmail(email);

            const user = await User.findOne({ email: lowerEmail });
            if (!user) return res.status(400).json({ success: false, message: "Invalid email or password." });
            
            const isPasswordVerified = await verifyHashedPass(password, user.password);
            if (!isPasswordVerified) return res.status(400).json({ success: false, message: "Invalid email or password." });

            const payload = {
                _id: user._id.toString(),
                email: user.email,
                role: user.role
            };

            const token = await createJWT(payload);
            const cleanUser = sanitizeUser(user)

            return res.status(200).json({ success: true, message: "Signin successfully.", user: cleanUser, token });

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "Internal server error", success: false,
            });
        }
    },
    fotgotPassword: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            const lowerEmail = toLowerEmail(email);

            const user = await User.findOne({ email: lowerEmail });
            if (!user) return res.status(400).json({ success: false, message: "We couldn't find an account with that email address." });

            const OTP = await createOtp();
            user.otpCode = OTP;
            user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
            await user.save();

            await sendEmail({
                to: lowerEmail,
                subject: "Reset Your Password",
                otp: OTP,
                name: `${user.firstName} ${user.lastName}`,
                templatePath: "../templates/fotgotPassword.html",
            });
            res.status(200).json({ success: true, message: "Email send successfully." });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "Internal server error", success: false,
            });
        }
    },
    verifyOtp: async (req: Request, res: Response) => {
        try {
            const { email, otp } = req.body;

            const lowerEmail = toLowerEmail(email);

            const user = await User.findOne({ email: lowerEmail });
            if (!user) return res.status(400).json({ success: false, message: "We couldn't find an account with that email address." });

            const inputOtp = String(otp).trim();
            const savedOtp = String(user.otpCode).trim();

            if (inputOtp !== savedOtp) return res.status(400).json({ success: false, message: "Invalid OTP. Please enter the correct code." });

            if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
                return res.status(400).json({
                    success: false, message: "OTP expired. Please request a new one.",
                });
            }

            res.status(200).json({ success: true, message: "OTP has been successfully verified." });

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "Internal server error", success: false,
            });
        }
    },
    resetPassword: async (req: Request, res: Response) => {
        try {
            const { email, password, confirmPassword } = req.body;

            if (password !== confirmPassword) {
                return res.status(400).json({
                    success: false, message: "Password and Confirm Password do not match."
                });
            }

            const lowerEmail = toLowerEmail(email);

            const user = await User.findOne({ email: lowerEmail });

            if (!user) return res.status(400).json({ success: false, message: "We couldn't find an account with that email address." });

            const hashedPassword = await createHashedPassword(password)
            await User.findByIdAndUpdate(
                { _id: user?._id },
                { password: hashedPassword, otpCode: "", otpExpiresAt: null },
                { new: true }
            );
            res.status(200).json({
                success: true, message: "Your password has been changed successfully.",
            });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "Internal server error", success: false,
            });
        }
    },
}