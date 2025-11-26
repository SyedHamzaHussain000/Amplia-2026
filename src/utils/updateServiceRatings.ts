import mongoose from "mongoose";
import { Rating } from "../models/rating";
import { Service } from "../models/services";

export const updateServiceRatings = async (serviceId: string) => {
  const ratingsData = await Rating.aggregate([
    { $match: { service: new mongoose.Types.ObjectId(serviceId) } },
    { $group: { _id: "$service", average: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);

  const averageRating = ratingsData[0]?.average || 0;
  const ratingCount = ratingsData[0]?.count || 0;

  await Service.findByIdAndUpdate(serviceId, {
    averageRating,
    ratingCount
  });
};
