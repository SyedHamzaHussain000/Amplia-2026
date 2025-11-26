import Jwt from "jsonwebtoken";
import { jwtSecret } from "../config/env";
import { JwtPayload } from "../types";

export const createJWT = async (payload: JwtPayload) => {
    try {
        const token = await Jwt.sign(payload, jwtSecret as string, { expiresIn: "7d" })
        return token
    } catch (error) {
        return error
    }
}