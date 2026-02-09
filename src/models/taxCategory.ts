import mongoose, { Schema, Document } from "mongoose";

export interface ITaxCategory extends Document {
    name: string;
    year: number;
    rate: number;
    taxType: 'Salary' | 'Business';
    filerStatus: 'Filer' | 'Non-Filer';
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TaxCategorySchema: Schema = new Schema({
    name: { type: String, required: true },
    year: { type: Number, required: true },
    rate: { type: Number, required: true }, // Percentage rate
    taxType: { type: String, enum: ['Salary', 'Business'], required: true, default: 'Salary' },
    filerStatus: { type: String, enum: ['Filer', 'Non-Filer'], required: true, default: 'Filer' },
    description: { type: String },
}, { timestamps: true });

export const TaxCategory = mongoose.model<ITaxCategory>("TaxCategory", TaxCategorySchema);
