import { Request, Response } from "express";
import { Service } from "../models/services";
import { Rating } from "../models/rating";
import { Booking } from "../models/booking";
import { BookingStatus } from "../constants/roles";
import mongoose from "mongoose";
import { updateServiceRatings } from "../utils/updateServiceRatings";

export const RatingController = {
    createRating: async (req: Request, res: Response) => {
        try {
            const _id = req._id
            const { service, booking: bookingId, rating, review } = req.body;

            const serviceExist = await Service.findById(service);
            if (!serviceExist) return res.status(404).json({ success: false, message: "Service not found" });

            const booking = await Booking.findById(bookingId);
            if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

            if (booking.status !== BookingStatus.COMPLETED) {
                return res.status(400).json({ success: false, message: "You can only rate completed bookings" });
            }

            if (booking.user.toString() !== _id) {
                return res.status(403).json({ success: false, message: "You are not authorized to rate this booking" });
            }

            const existingRating = await Rating.findOne({ user: _id, booking: bookingId });
            if (existingRating) return res.status(400).json({ success: false, message: "You already rated this booking" });

            const newRating = await Rating.create({
                user: _id, service, booking: bookingId, rating, review
            });

            await Service.findByIdAndUpdate(service, { $push: { ratings: newRating._id } });
            await Booking.findByIdAndUpdate(bookingId, { rating: newRating._id });

            await updateServiceRatings(service);

            await newRating.populate('user', '_id firstName lastName email profile')
            return res.status(201).json({ success: true, message: "Rating added successfully", rating: newRating });

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    updateRating: async (req: Request, res: Response) => {
        try {
            const _id = req._id;
            const { ratingId } = req.params;
            const { rating, review } = req.body

            const updates: any = {};

            if (rating !== undefined) updates.rating = rating;
            if (review !== undefined) updates.review = review;

            const ratingDoc = await Rating.findById(ratingId);
            if (!ratingDoc) return res.status(404).json({ success: false, message: "Rating not found" });

            if (ratingDoc.user.toString() !== _id) return res.status(403).json({ success: false, message: "Unauthorized" });

            Object.assign(ratingDoc, updates);
            await ratingDoc.save();

            await updateServiceRatings(ratingDoc.service.toString());

            await ratingDoc.populate("user", "_id firstName lastName email profile");

            return res.status(200).json({
                success: true, message: "Rating updated successfully", rating: ratingDoc
            });

        } catch (err) {
            res.status(500).json({
                success: false, message: err instanceof Error ? err.message : "Internal server error",
            });
        }
    },
    deleteRating: async (req: Request, res: Response) => {
        try {
            const _id = req._id;
            const { ratingId } = req.params;

            const ratingDoc = await Rating.findById(ratingId);
            if (!ratingDoc) return res.status(404).json({ success: false, message: "Rating not found" });

            if (ratingDoc.user.toString() !== _id) return res.status(403).json({ success: false, message: "Unauthorized" });

            const serviceId = ratingDoc.service.toString();

            await Rating.findByIdAndDelete(ratingId);

            await Service.findByIdAndUpdate(serviceId, {
                $pull: { ratings: ratingId }
            });

            await updateServiceRatings(serviceId);

            return res.status(200).json({
                success: true, message: "Rating deleted successfully",
            });

        } catch (err) {
            res.status(500).json({
                success: false, message: err instanceof Error ? err.message : "Internal server error",
            });
        }
    },
    getRating: async (req: Request, res: Response) => {
        try {
            const { ratingId } = req.params;
            const { user, service } = req.query;

            if (ratingId) {
                const rating = await Rating.findById(ratingId)
                    .populate("user", "_id firstName lastName email profile")
                    .populate("service", "_id name cover description");

                if (!rating) return res.status(404).json({ success: false, message: "Rating not found" });

                return res.status(200).json({ success: true, rating });
            }

            const filter: any = {};

            if (user) filter.user = user;
            if (service) filter.service = service;

            const ratings = await Rating.find(filter)
                .populate("user", "_id firstName lastName email profile")
                .populate("service", "_id name cover description")
                .sort({ createdAt: -1 });

            let distribution = null;
            if (service) {
                const stats = await Rating.aggregate([
                    { $match: { service: new mongoose.Types.ObjectId(service as string) } },
                    { $group: { _id: "$rating", count: { $sum: 1 } } }
                ]);

                distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                stats.forEach(s => {
                    // @ts-ignore
                    distribution[s._id] = s.count;
                });
            }

            return res.status(200).json({
                success: true,
                count: ratings.length,
                ratings,
                distribution
            });

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err instanceof Error ? err.message : "Internal server error",
            });
        }
    }
}