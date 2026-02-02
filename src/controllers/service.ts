import { Request, Response } from "express";
import { Category } from "../models/category";
import { createCoverUrl } from "../utils/createCoverUrl";
import { Service } from "../models/services";

export const ServiceController = {
    createService: async (req: Request, res: Response) => {
        try {
            const { name, category, description, price, billingCycle, features, plans, isActive } = req.body;

            const categoryExists = await Category.findById(category);
            if (!categoryExists) return res.status(404).json({ success: false, message: "Category not found." });

            const existingService = await Service.findOne({ name: name.trim() });
            if (existingService) {
                if (existingService.isDeleted) {
                    return res.status(400).json({
                        success: false,
                        message: "A service with this name was previously deleted. Please choose a different name or restore the deleted service."
                    });
                }

                return res.status(400).json({
                    success: false, message: "A service with this name already exists."
                });
            }

            const coverUrl = createCoverUrl(req);

            let plansData = plans;

            let featuresData: any = features;
            if (typeof featuresData === "string") {
                try {
                    featuresData = JSON.parse(featuresData);
                } catch (err) {
                    featuresData = [];
                }
            }

            const newService = await Service.create({
                name: name.trim(),
                category,
                description,
                price: Number(price),
                billingCycle,
                features: Array.isArray(featuresData) ? featuresData : [],
                cover: coverUrl,
                plans: plansData || 'standard',
                isActive: isActive !== undefined ? isActive : true,
            });

            await newService.populate("category");

            res.status(201).json({ success: true, message: "Service created successfully.", service: newService });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    updateService: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, category, description, price, billingCycle, features, plans, isActive } = req.body;

            const service = await Service.findById(id);
            if (!service) return res.status(404).json({ success: false, message: "Service not found." });

            const updateData: any = {};

            if (name && name.trim() !== service.name) {
                const existingService = await Service.findOne({ name: name.trim() });
                if (existingService) return res.status(400).json({ success: false, message: "A service with this name already exists." });

                updateData.name = name.trim();
            }

            if (category) {
                const categoryExists = await Category.findById(category);
                if (!categoryExists) return res.status(404).json({ success: false, message: "Category not found." });
                updateData.category = category;
            }

            if (description !== undefined) updateData.description = description;
            if (price !== undefined) updateData.price = Number(price);
            if (billingCycle !== undefined) updateData.billingCycle = billingCycle;

            if (features) {
                let featuresData: any = features;
                if (typeof featuresData === "string") {
                    try {
                        featuresData = JSON.parse(featuresData);
                    } catch (err) {
                        featuresData = [];
                    }
                }
                updateData.features = Array.isArray(featuresData) ? featuresData : [];
            }

            const coverUrl = createCoverUrl(req);
            if (coverUrl) updateData.cover = coverUrl;

            if (plans) {
                updateData.plans = plans;
            }

            if (isActive !== undefined) updateData.isActive = isActive;

            const updatedService = await Service.findByIdAndUpdate(id, updateData,
                { new: true, runValidators: true }).populate("category")

            return res.status(200).json({
                success: true, message: "Service updated successfully.", service: updatedService
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "*Internal server error"
            });
        }
    },
    deleteService: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const service = await Service.findById(id);
            if (!service) return res.status(404).json({ success: false, message: "Service not found." });

            service.isDeleted = true;
            service.deletedAt = new Date();
            await service.save();

            return res.status(200).json({ success: true, message: "Service deleted successfully." });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "*Internal server error"
            });
        }
    },
    getService: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { search, category } = req.query;

            if (id) {
                const service = await Service.findById(id).populate([
                    { path: 'category' },
                    {
                        path: 'ratings',
                        select: '-service',
                        populate: { path: 'user', select: '_id firstName lastName email profile' }
                    }])
                if (!service) return res.status(404).json({ success: false, message: "Service not found." });

                return res.status(200).json({
                    success: true, message: "Service fetched successfully.", service
                });
            }

            const query: any = {};
            if (search && typeof search === "string") {
                query.name = { $regex: search, $options: "i" };
            }
            if (category && typeof category === "string") {
                query.category = category;
            }

            const services = await Service.find(query).populate([
                { path: 'category' },
                {
                    path: 'ratings',
                    select: '-service',
                    populate: { path: 'user', select: '_id firstName lastName email profile' }
                }]).sort({ averageRating: -1, createdAt: -1 });

            return res.status(200).json({
                success: true, message: "Services fetched successfully.", services
            });

        } catch (error) {
            return res.status(500).json({
                success: false, message: error instanceof Error ? error.message : "*Internal server error"
            });
        }
    },
    getServicesByCategory: async (req: Request, res: Response) => {
        try {
            const { categoryId } = req.params;

            const services = await Service.find({ category: categoryId }).populate("category").sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                message: "Services fetched successfully.",
                services
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "*Internal server error"
            });
        }
    }
}