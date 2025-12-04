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
            const { id } = req.params;
            const { status } = req.body;
            const io = req.app.get("socketio");

            let chat = await Chat.findById(id);
            if (!chat) return res.status(404).json({ success: false, message: "Chat not found." });

            if (chat.status === ChatStatus.RESOLVED) {
                return res.status(400).json({
                    success: false, message: "Chat is already resolved and cannot be updated anymore."
                });
            }

            if (status === ChatStatus.ACTIVE) {
                if (!chat.admin) {
                    chat.admin = new mongoose.Types.ObjectId(_id);
                    chat.chatKey = `${chat.user.toString()}${_id.toString()}`;
                }

                chat.status = ChatStatus.ACTIVE;
                chat.resolvedBy = null;
            }

            if (status === ChatStatus.RESOLVED) {
                chat.status = ChatStatus.RESOLVED;
                chat.resolvedBy = new mongoose.Types.ObjectId(_id);
            }

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

            if (chat.status === ChatStatus.RESOLVED) {
                return res.status(400).json({
                    success: false, message: "This chat is already resolved. You cannot send more messages.",
                });
            }

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
    },
    markSeen: async (req: Request, res: Response) => {
        try {
            const _id = req._id
            const { messageIds } = req.body;
            const io = req.app.get("socketio");

            if (!Array.isArray(messageIds) || messageIds.length === 0) {
                return res.status(400).json({ success: false, message: "No message IDs provided." });
            }

            const objectIds = messageIds.map((id: string) => new mongoose.Types.ObjectId(id));

            const messages = await Message.find({ _id: { $in: objectIds } });

            if (!messages.length) {
                return res.status(404).json({ success: false, message: "Messages not found." });
            }

            const messagesToUpdate = messages.filter(msg => msg.sender.toString() !== _id);

            if (!messagesToUpdate.length) {
                return res.status(200).json({ success: true, message: "No messages to update." });
            }

            const updateIds = messagesToUpdate.map(msg => msg._id);

            await Message.updateMany(
                { _id: { $in: updateIds } },
                { $set: { seen: true } }
            );

            const chatId = messagesToUpdate[0].chat.toString();
            io.to(chatId).emit("messages_seen", updateIds);

            res.status(200).json({
                success: true, message: "Messages marked as seen.", messageIds: updateIds,
            });

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: true,
            });
        }
    },
    get: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { status } = req.query;

            if (status && !Object.values(ChatStatus).includes(status as ChatStatus) && status !== "all") {
                return res.status(400).json({
                    success: false,
                    message: `Invalid status '${status}'. Valid values are 'all', '${ChatStatus.ACTIVE}', '${ChatStatus.PENDING}', '${ChatStatus.RESOLVED}'.`
                });
            }

            if (id) {
                const chat = await Chat.findById(id)
                    .populate(getChatPopulate({ withAdmin: true, withUser: true, withMessages: true, withResolved: true }));

                if (!chat) return res.status(404).json({ success: false, message: "Chat not found." });

                return res.status(200).json({
                    success: true, message: "Chat fetched successfully.", chat,
                });
            }

            const filters: any = {};
            if (status && status !== "all") {
                filters.status = status;
            }

            const chats = await Chat.find(filters)
                .sort({ createdAt: -1 })
                .populate(getChatPopulate({ withAdmin: true, withUser: true, withMessages: true, withResolved: true }));

            if (chats.length === 0) {
                const message = status && status !== "all" ? `No chats found with status '${status}'.`
                    : "No chats found.";

                return res.status(200).json({ success: true, message, chats });
            }

            return res.status(200).json({
                success: true, message: "Chats fetched successfully.", chats,
            });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: true,
            });
        }
    }
}