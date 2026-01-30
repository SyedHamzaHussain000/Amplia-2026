import mongoose, { Schema } from "mongoose";
import { IPlan, IService } from "../types";
import { Query } from "mongoose";

const ServiceSchema = new Schema<IService>({
    name: { type: String, required: true, trim: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, },
    description: { type: String, default: "" },
    cover: { type: String, default: "" },
    price: { type: Number, default: 0 },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    features: { type: [String], default: [] },

    plans: {
        type: String,
        enum: ['standard', 'premium', 'gold', 'platinum'],
        default: 'standard',
        required: true,
    },
    isActive: { type: Boolean, default: true },
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });


ServiceSchema.pre<Query<IService[], IService>>(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});

export const Service = mongoose.model<IService>("Service", ServiceSchema);
