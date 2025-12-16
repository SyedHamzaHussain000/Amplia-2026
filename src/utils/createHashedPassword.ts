import bcrypt from "bcrypt"

export const createHashedPassword = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword
    } catch (error) {
        throw error;
    }
}
