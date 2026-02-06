import { Request, Response } from "express";
import { File } from "../models/file";
import { Booking } from "../models/booking";
import { IFile } from "../types";
import { UserRole } from "../constants/roles";

export const FileController = {
    add: async (req: Request, res: Response) => {
        try {
            const { name, year, bookingId } = req.body
            if (!req.file) return res.status(400).json({ success: false, message: "PDF file is required." });

            // If not linked to a booking, check for uniqueness by name+year (global files)
            if (!bookingId) {
                const existingFile = await File.findOne({ name, year, booking: null });
                if (existingFile) {
                    return res.status(400).json({
                        success: false, message: `A file with name '${name}' for year '${year}' already exists.`
                    });
                }
            }

            const url = req.file.filename;

            // @ts-ignore
            const uploadedBy = req._id;

            const newFile = await File.create({
                name,
                year,
                url,
                booking: bookingId || null,
                uploadedBy: uploadedBy || null
            });

            res.status(201).json({
                success: true, message: "File uploaded successfully.", file: newFile
            });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, year } = req.body;

            const file = await File.findById(id);
            if (!file) return res.status(404).json({ success: false, message: "File not found." });

            if (name) file.name = name;
            if (year) file.year = year;

            if (req.file) {
                const url = req.file.filename;
                file.url = url;
            }

            await file.save();

            res.status(200).json({
                success: true, message: "File updated successfully.", file
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

            const file = await File.findById(id);
            if (!file) return res.status(404).json({ success: false, message: "File not found." });

            file.isDeleted = true;
            file.deletedAt = new Date();

            await file.save();

            res.status(200).json({
                success: true, message: "File deleted successfully.",
            });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    get: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { search, year, bookingId } = req.query;

            if (id) {
                const file = await File.findById(id);

                if (!file) return res.status(404).json({ success: false, message: "File not found.", });

                return res.status(200).json({
                    success: true, message: "File fetched successfully.", file,
                });
            }

            let filters: any = {};

            if (search) filters.name = { $regex: search, $options: "i" };
            if (year) filters.year = Number(year);

            // @ts-ignore
            if (req.role === UserRole.USER) {
                // @ts-ignore
                const userBookings = await Booking.find({ user: req._id }).select('_id');
                const userBookingIds = userBookings.map(b => b._id.toString());

                if (bookingId) {
                    // If user requested a specific booking, verify ownership
                    if (userBookingIds.includes(bookingId.toString())) {
                        filters.booking = bookingId;
                    } else {
                        return res.status(403).json({ success: false, message: "Access denied to this booking's files." });
                    }
                } else {
                    // User sees files linked to all their bookings
                    filters.booking = { $in: userBookingIds };
                }
            } else {
                if (bookingId) filters.booking = bookingId;
            }


            const files = await File.find(filters).populate('booking', 'service status').sort({ createdAt: -1 });

            if (files.length === 0) {
                let message = "No files found.";
                if (search && year) message = `No files found matching '${search}' for year '${year}'.`;
                else if (search) message = `No files found matching '${search}'.`;
                else if (year) message = `No files found for year '${year}'.`;

                return res.status(200).json({ success: true, message, files: [] });
            }

            return res.status(200).json({
                success: true, message: "Files fetched successfully.", files,
            });

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
}