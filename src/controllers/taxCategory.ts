import { Request, Response } from "express";
import { TaxCategory } from "../models/taxCategory";

export const TaxCategoryController = {
    create: async (req: Request, res: Response) => {
        try {
            const { name, year, rate, description, taxType, filerStatus, brackets } = req.body;
            const category = await TaxCategory.create({ name, year, rate, description, taxType, filerStatus, brackets });
            res.status(201).json({ success: true, data: category });
        } catch (error) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
        }
    },

    getAll: async (req: Request, res: Response) => {
        try {
            const { year, taxType, filerStatus } = req.query;
            const filter: any = {};
            if (year) filter.year = Number(year);
            if (taxType) filter.taxType = taxType;
            if (filerStatus) filter.filerStatus = filerStatus;

            const categories = await TaxCategory.find(filter).sort({ year: -1, name: 1 });
            res.status(200).json({ success: true, data: categories });
        } catch (error) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const category = await TaxCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

            const monthlyIncome = Number(amount);
            const annualIncome = monthlyIncome * 12;
            let taxAmount = 0;

            if (category.brackets && category.brackets.length > 0) {
                // Progressive Tax Calculation
                // Format: (annualIncome - min) * rate + base
                const sortedBrackets = [...category.brackets].sort((a, b) => a.min - b.min);
                const applicableBracket = sortedBrackets.reverse().find(b => annualIncome > b.min) || sortedBrackets[0];

                if (applicableBracket) {
                    const taxableAmount = annualIncome - (applicableBracket.min);
                    const annualTax = (taxableAmount * applicableBracket.rate) / 100 + applicableBracket.base;
                    taxAmount = annualTax / 12;
                }
            } else {
                // Flat Rate Calculation
                taxAmount = (monthlyIncome * category.rate) / 100;
            }

            res.status(200).json({
                success: true,
                data: {
                    category: category.name,
                    year: category.year,
                    rate: category.rate,
                    originalAmount: monthlyIncome,
                    taxAmount: Number(taxAmount.toFixed(2)),
                    totalAmount: Number((monthlyIncome + taxAmount).toFixed(2))
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
        }
    }
};
