import mongoose, { Query, Schema } from "mongoose";
import { IChat } from "../types";
import { ChatStatus } from "../constants/roles";

const ChatSchema = new Schema<IChat>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    admin: { type: Schema.Types.ObjectId, ref: "User", default: null },
    activeSubAdmin: { type: Schema.Types.ObjectId, ref: "User", default: null },
    booking: { type: Schema.Types.ObjectId, ref: "Booking", default: null },
    chatKey: { type: String, required: true },
    status: { type: String, enum: Object.values(ChatStatus), default: ChatStatus.PENDING },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message", default: [] }],
    resolvedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });

ChatSchema.pre<Query<IChat & { isDeleted: boolean; deletedAt?: Date }, IChat>>(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);
