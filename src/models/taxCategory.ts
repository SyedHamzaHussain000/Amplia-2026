import mongoose, { Schema, Document } from "mongoose";

export interface ITaxCategory extends Document {
    name: string;
    year: number;
    rate: number;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TaxCategorySchema: Schema = new Schema({
    name: { type: String, required: true },
    year: { type: Number, required: true },
    rate: { type: Number, required: true }, // Percentage rate
    description: { type: String },
}, { timestamps: true });

export const TaxCategory = mongoose.model<ITaxCategory>("TaxCategory", TaxCategorySchema);
