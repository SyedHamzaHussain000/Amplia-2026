import mongoose from "mongoose";
import { Document } from "mongoose";

export interface IRating extends Document {
    user:  mongoose.Types.ObjectId; 
    service:  mongoose.Types.ObjectId;
    rating: number;
    review?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
