import mongoose, { Schema } from "mongoose";
import { IRating } from "../types";

const RatingSchema = new Schema<IRating>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true }
}, { timestamps: true });

// Prevent user from rating same service twice
RatingSchema.index({ user: 1, service: 1 }, { unique: true });

export const Rating = mongoose.model<IRating>("Rating", RatingSchema);
