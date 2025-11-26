import { Request, Response } from "express";
import { Service } from "../models/services";
import { Rating } from "../models/rating";
import mongoose from "mongoose";
import { updateServiceRatings } from "../utils/updateServiceRatings";

export const RatingController = {
    createRating: async (req: Request, res: Response) => {
        try {
            const _id = req._id
            const { service, rating, review } = req.body;

            const serviceExist = await Service.findById(service);
            if (!serviceExist) return res.status(404).json({ success: false, message: "Service not found" });

            const existingRating = await Rating.findOne({ user: _id, service });
            if (existingRating) return res.status(400).json({ success: false, message: "You already rated this service" });

            const newRating = await Rating.create({
                user: _id, service, rating, review
            });

            await Service.findByIdAndUpdate(service, { $push: { ratings: newRating._id } });

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
                    .populate("service", "_id name cover");

                if (!rating) return res.status(404).json({ success: false, message: "Rating not found" });

                return res.status(200).json({ success: true, rating });
            }

            // -------------------------
            // 2. Build dynamic filter
            // -------------------------
            const filter: any = {};

            if (user) filter.user = user;
            if (service) filter.service = service;

            // -------------------------
            // 3. Fetch ratings based on filters
            // -------------------------
            const ratings = await Rating.find(filter)
                .populate("user", "_id firstName lastName email profile")
                .populate("service", "_id name cover")
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                count: ratings.length,
                ratings
            });

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err instanceof Error ? err.message : "Internal server error",
            });
        }
    }
}