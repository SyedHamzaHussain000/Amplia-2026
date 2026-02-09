import mongoose, { Schema, Document } from "mongoose";

export interface ITaxBracket {
    min: number;
    max: number;
    rate: number;
    base: number;
}

export interface ITaxCategory extends Document {
    name: string;
    year: number;
    rate: number;
    taxType: string;
    filerStatus: 'Filer' | 'Non-Filer';
    brackets: ITaxBracket[];
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TaxCategorySchema: Schema = new Schema({
    name: { type: String, required: true },
    year: { type: Number, required: true },
    rate: { type: Number, required: true }, // Percentage rate
    taxType: { type: String, required: true, default: 'Salary' },
    filerStatus: { type: String, enum: ['Filer', 'Non-Filer'], required: true, default: 'Filer' },
    brackets: [{
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        rate: { type: Number, required: true },
        base: { type: Number, required: true },
    }],
    description: { type: String },
}, { timestamps: true });

export const TaxCategory = mongoose.model<ITaxCategory>("TaxCategory", TaxCategorySchema);
