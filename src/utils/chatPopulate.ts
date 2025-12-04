import { IGetChatPopulate } from "../types";

export const getChatPopulate = (options?: IGetChatPopulate) => {
    const populate: any[] = [];

    if (options?.withUser) {
        populate.push({ path: 'user', select: '_id firstName lastName profile role' });
    }

    if (options?.withAdmin) {
        populate.push({ path: 'admin', select: '_id firstName lastName profile role' });
    }

    if (options?.withResolved) {
        populate.push({ path: 'resolvedBy', select: '_id firstName lastName profile role' });
    }

    if (options?.withMessages) {
        populate.push({
            path: 'messages',
            select: '-chat -isDeleted -deletedAt -updatedAt',
            populate: { path: 'sender', select: '_id firstName lastName profile role' }
        });
    }

    return populate;
};
