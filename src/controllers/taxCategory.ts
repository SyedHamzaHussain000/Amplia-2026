import { Request, Response } from "express";
import { TaxCategory } from "../models/taxCategory";

export const TaxCategoryController = {
    create: async (req: Request, res: Response) => {
        try {
            const { name, year, rate, description } = req.body;
            const category = await TaxCategory.create({ name, year, rate, description });
            res.status(201).json({ success: true, data: category });
        } catch (error) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
        }
    },

    getAll: async (req: Request, res: Response) => {
        try {
            const { year } = req.query;
            const filter = year ? { year: Number(year) } : {};
            const categories = await TaxCategory.find(filter).sort({ year: -1, name: 1 });
            res.status(200).json({ success: true, data: categories });
        } catch (error) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const category = await TaxCategory.findByIdAndUpdate(id, req.body, { new: true });
            if (!category) return res.status(404).json({ success: false, message: "Category not found" });
            res.status(200).json({ success: true, data: category });
        } catch (error) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const category = await TaxCategory.findByIdAndDelete(id);
            if (!category) return res.status(404).json({ success: false, message: "Category not found" });
            res.status(200).json({ success: true, message: "Category deleted" });
        } catch (error) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
        }
    },

    calculate: async (req: Request, res: Response) => {
        try {
            const { categoryId, amount } = req.body;
            const category = await TaxCategory.findById(categoryId);
            if (!category) return res.status(404).json({ success: false, message: "Category not found" });

            const taxAmount = (Number(amount) * category.rate) / 100;
            res.status(200).json({
                success: true,
                data: {
                    category: category.name,
                    year: category.year,
                    rate: category.rate,
                    originalAmount: amount,
                    taxAmount: taxAmount,
                    totalAmount: Number(amount) + taxAmount
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
        }
    }
};
