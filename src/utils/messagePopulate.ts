import { IGetMessagePopulate } from "../types";

export const getMessagePopulate = (options?: IGetMessagePopulate) => {
    const populate: any[] = [];

    if (options?.withSender) {
        populate.push({ path: 'sender', select: '_id firstName lastName profile' });
    }

    return populate;
};
