import mongoose, { Schema } from "mongoose";
import { IPlan, IService } from "../types";
import { Query } from "mongoose";

const PlanSchema = new Schema<IPlan>({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
}, { _id: false });

const ServiceSchema = new Schema<IService>({
    name: { type: String, required: true, trim: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, },
    description: { type: String, default: "" },
    cover: { type: String, default: "" },
    plans: {
        type: [PlanSchema], required: true, validate: {
            validator: (arr: IPlan[]) => arr.length > 0,
            message: "At least one plan is required.",
        },
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
