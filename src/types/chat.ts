import { Types } from "mongoose";
import { ChatStatus } from "../constants/roles";

export interface IChat extends Document {
    user: Types.ObjectId;
    admin: Types.ObjectId | null;
    chatKey: string;
    status: ChatStatus;
    messages: Types.ObjectId[];
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}