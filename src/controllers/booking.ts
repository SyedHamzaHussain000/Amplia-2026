import { Request, Response } from "express";
import { Service } from "../models/services";
import { Booking } from "../models/booking";
import { ICategory, IService } from "../types";

export const BookingController = {
    create: async (req: Request, res: Response) => {
        try {
            const _id = req._id
            const { service, planName, scheduledDate, status } = req.body;

            const serviceExist = await Service.findById(service).populate<{ category: ICategory }>('category');
            if (!serviceExist) return res.status(404).json({ success: false, message: "Service not found" });

            const plan = serviceExist.plans.find((p: any) => p.name === planName);
            if (!plan) return res.status(400).json({ success: false, message: "Plan not found in service" });

            const booking = await Booking.create({
                user: _id,
                service: {
                    _id: serviceExist._id,
                    name: serviceExist.name,
                    category: serviceExist.category.name || 'Unknown',
                    description: serviceExist.description,
                    cover: serviceExist.cover,
                    plan: plan,
                },
                status,
                scheduledDate,
            });
            res.status(200).json({ success: true, message: 'Your booking is confirmed.', booking })

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    updateStatus: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const booking = await Booking.findById(id);
            if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

            booking.status = status
            await booking.save();

            res.status(200).json({
                success: true, message: `Booking status updated to ${status}.`, booking
            });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const booking = await Booking.findById(id);
            if (!booking || booking.isDeleted) {
                return res.status(404).json({ success: false, message: "Booking not found" });
            }

            booking.isDeleted = true;
            booking.deletedAt = new Date();
            await booking.save();

            res.status(200).json({ success: true, message: "Booking deleted successfully." });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    getBooking: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { user, status, service, search } = req.query;

            if (id) {
                const booking = await Booking.findById(id)
                if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

                return res.status(200).json({ success: true, message: "Booking retrieved successfully.", booking });
            }

            const query: any = {};

            if (user) query.user = user;
            if (status) query.status = status;
            if (service) query['service._id'] = service;
            if (search) query['service.name'] = { $regex: search, $options: 'i' };

            const bookings = await Booking.find(query)
            return res.status(200).json({ success: true, message: "All bookings retrieved successfully.", bookings });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    }
}