import { Document, Types } from "mongoose";

export interface IFile extends Document {
    name: string;
    year: number;
    url: string;
    booking?: Types.ObjectId;
    uploadedBy?: Types.ObjectId;
    isDeleted: boolean;
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}