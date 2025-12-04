import { Types } from "mongoose";

export interface IMessage extends Document {
    chat: Types.ObjectId;
    sender: Types.ObjectId;
    seen: boolean;
    message?: string;
    media?: string[];
    files?: string[];
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}