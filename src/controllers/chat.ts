import { Request, Response } from "express";
import { Message } from "../models/message";
import { Chat } from "../models/chat";
import { ChatStatus } from "../constants/roles";
import mongoose from "mongoose";
import { getChatPopulate } from "../utils/chatPopulate";
import { getMessagePopulate } from "../utils/messagePopulate";

export const ChatController = {
    create: async (req: Request, res: Response) => {
        try {
            const _id = req._id;
            const io = req.app.get("socketio");

            let chat = await Chat.findOne({
                user: _id,
                status: { $in: [ChatStatus.PENDING, ChatStatus.ACTIVE] }
            }).populate(getChatPopulate({ withUser: true, withAdmin: true, withMessages: true }))

            if (chat) {
                return res.status(200).json({
                    success: true, message: `Existing ${chat.status} chat found.`, chat,
                });
            }

            const chatKey = _id.toString();

            chat = await Chat.create({
                user: _id,
                admin: null,
                status: ChatStatus.PENDING,
                chatKey,
                messages: [],
            });

            chat = await Chat.findById(chat._id).populate(getChatPopulate({ withUser: true, withAdmin: true }))

            io.emit("new_chat", chat);

            return res.status(201).json({
                success: true, message: "Chat created successfully.", chat,
            });

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    updateStatus: async (req: Request, res: Response) => {
        try {
            const _id = req._id;
            const { chatId } = req.params;
            const { status } = req.body;
            const io = req.app.get("socketio");

            let chat = await Chat.findById(chatId);
            if (!chat) return res.status(404).json({ success: false, message: "Chat not found." });

            if (!chat.admin) {
                chat.admin = new mongoose.Types.ObjectId(_id);
                chat.chatKey = `${chat.user.toString()}${_id.toString()}`;
            }

            chat.status = status;
            await chat.save();

            chat = await Chat.findById(chat._id)
                .populate(getChatPopulate({ withAdmin: true, withUser: true, withMessages: true }))

            io.emit("chat_status_changed", chat);

            res.status(200).json({
                success: true, message: `Chat status updated to '${status}'.`, chat,
            });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    sendMessage: async (req: Request, res: Response) => {
        try {
            const _id = req._id;
            const { message } = req.body;
            const { id } = req.params;
            const io = req.app.get("socketio");

            const chat = await Chat.findById(id);
            if (!chat) return res.status(404).json({ success: false, message: "Chat not found." });

            const files = (req.files as any)?.messageFile || [];
            const media = (req.files as any)?.media || [];

            const filesUrls = files.map((f: any) => `${req.protocol}://${req.get("host")}/${f.path.replace(/\\/g, '/')}`);
            const mediaUrls = media.map((f: any) => `${req.protocol}://${req.get("host")}/${f.path.replace(/\\/g, '/')}`);

            const newMessage = await Message.create({
                chat: chat._id,
                sender: _id,
                message: message || "",
                media: mediaUrls,
                files: filesUrls
            });

            chat.messages.push(newMessage._id);
            await chat.save();

            const populatedMessage = await newMessage.populate(getMessagePopulate({ withSender: true }))

            io.to(chat._id.toString()).emit("new_message", populatedMessage);

            res.status(201).json({
                success: true, message: "Message sent successfully", data: populatedMessage,
            });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    }
}