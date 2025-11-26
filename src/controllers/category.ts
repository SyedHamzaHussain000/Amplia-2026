import { Request, Response } from "express";
import { Category } from "../models/category";
import { createCoverUrl } from "../utils/createCoverUrl";
import { Service } from "../models/services";

export const CategoryController = {
    createCategory: async (req: Request, res: Response) => {
        try {
            const { name, description } = req.body;

            const existing = await Category.findOne({ name: name.trim() });
            if (existing) return res.status(400).json({ success: false, message: "Category with this name already exists." });

            const coverUrl = createCoverUrl(req);

            const newCategory = await Category.create({
                name: name,
                description: description || "",
                cover: coverUrl
            });

            return res.status(201).json({
                success: true, message: "Category created successfully", category: newCategory
            });

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    updateCategory: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            const category = await Category.findById(id);
            if (!category) return res.status(404).json({ success: false, message: "Category not found." });

            if (name && name.trim() !== category.name) {
                const exists = await Category.findOne({ name: name.trim() });
                if (exists) return res.status(400).json({ success: false, message: "Category with this name already exists." });
                category.name = name.trim();
            }
            if (description !== undefined) category.description = description;
            if (req.file) { category.cover = createCoverUrl(req) }

            const updatedCategory = await category.save();

            res.status(200).json({ success: true, message: "Category updated successfully.", category: updatedCategory, });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    deleteCategory: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const category = await Category.findById(id);
            if (!category) return res.status(404).json({ success: false, message: "Category not found." });

            const linkedServices = await Service.findOne({ category: id });
            if (linkedServices) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot delete this category. Some services are linked to it. Please update or remove those services first."
                });
            }

            await category.deleteOne();
            return res.status(200).json({ success: true, message: "Category deleted successfully." });

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    getCategory: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { search } = req.query as { search?: string };
            if (id) {
                const category = await Category.findById(id);
                if (!category) return res.status(404).json({ success: false, message: "Category not found" });

                return res.status(200).json({ success: true, message: "Category fetched successfully", category })
            }

            const query: any = {};
            if (search) {
                query.name = { $regex: new RegExp(search, "i") };
            }

            const categories = await Category.find(query).sort({ createdAt: -1 });
            return res.status(200).json({
                success: true, message: 'Categories fetched successfully', categories
            });

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    }
}