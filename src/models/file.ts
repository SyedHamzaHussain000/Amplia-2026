import mongoose, { Query, Schema } from "mongoose";
import { IFile } from "../types";

const FileSchema = new Schema<IFile>({
    name: { type: String, required: true },
    year: { type: Number, required: true },
    url: { type: String, required: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking", default: null },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });

FileSchema.pre<Query<IFile & { isDeleted: boolean; deletedAt?: Date }, IFile>>(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});

export const File = mongoose.model<IFile>("File", FileSchema);