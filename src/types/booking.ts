import { Types } from "mongoose";
import { Document } from "mongoose";
import { BookingStatus } from "../constants/roles";

export interface IBookedServicePlan {
    name: string;
    price: number;
    description?: string;
}

export interface IBookedService {
    _id: Types.ObjectId;
    name: string;
    category: string;
    description: string;
    cover: string;
    plan: IBookedServicePlan;
}

export interface IBooking extends Document {
    user: Types.ObjectId;
    service: IBookedService;
    status: BookingStatus;
    startDate?: Date;
    endDate?: Date;
    isDeleted: boolean;
    deletedAt?: Date;
}