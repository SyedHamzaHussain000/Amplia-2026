import mongoose, { Query, Schema } from "mongoose";
import { IMessage } from "../types";

const MessageSchema = new mongoose.Schema<IMessage>({
    chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seen: { type: Boolean, default: false },
    message: { type: String },
    media: [{ type: String }],
    files: [{ type: String }],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });

MessageSchema.pre<Query<IMessage & { isDeleted: boolean; deletedAt?: Date }, IMessage>>(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
