import { Document } from "mongoose";

export interface ICategory extends Document {
    name: string;
    description: string;
    icon: string;
    cover: string;
    createdAt?: Date;
    updatedAt?: Date;
}