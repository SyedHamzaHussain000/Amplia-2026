import mongoose, { Schema, Document } from "mongoose";

export interface IPlan extends Document {
    name: string;
    price: number;
    description?: string;
}

export interface IService extends Document {
    name: string;
    category: mongoose.Types.ObjectId;
    description?: string;
    cover?: string;
    plans: IPlan[];
    isActive: boolean;
    ratings: mongoose.Types.ObjectId[]; 
    averageRating: number; 
    ratingCount: number;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted: boolean;
    deletedAt: Date | null;
}