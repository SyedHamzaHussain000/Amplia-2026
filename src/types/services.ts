import mongoose, { Document } from "mongoose";
import { ICategory } from "./category";

export type PlanTier = 'standard' | 'premium' | 'gold' | 'platinum';

export interface IPlan extends Document {
    name: string;
    price: number;
    description?: string;
}

export interface IService extends Document {
    name: string;
    category: mongoose.Types.ObjectId | ICategory;
    description?: string;
    cover?: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    features: string[];
    plans: PlanTier;
    isActive: boolean;
    ratings: mongoose.Types.ObjectId[];
    averageRating: number;
    ratingCount: number;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted: boolean;
    deletedAt: Date | null;
}