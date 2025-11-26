import mongoose, { Schema } from "mongoose";
import { ICategory } from "../types";

const CategorySchema = new Schema<ICategory>({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    cover: { type: String, default: "" },
}, { timestamps: true });

export const Category = mongoose.model<ICategory>("Category", CategorySchema);