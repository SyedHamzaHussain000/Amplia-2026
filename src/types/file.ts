import { Document } from "mongoose";

export interface IFile extends Document {
    name: string;
    year: number;
    url: string;
    isDeleted: boolean;
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}