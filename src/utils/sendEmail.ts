import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { appEmail, appPassword } from "../config/env";
import { SendMailOptions } from "../types";

export const sendEmail = async ({ to, subject, otp, name, templatePath, }: SendMailOptions) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: appEmail,
                pass: appPassword,
            },
        });

        const resolvedTemplatePath = path.resolve(__dirname, templatePath);
        let html = fs.readFileSync(resolvedTemplatePath, "utf-8");

        html = html.replace(/{{OTP}}/g, otp);
        html = html.replace(/{{name}}/g, name);

        const mailOptions = {
            from: `"Amplia" <${appEmail}>`,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent: ${to}`, info.response);
    } catch (error) {
        console.error("❌ Failed to send email:", error);
        throw error;
    }
};
