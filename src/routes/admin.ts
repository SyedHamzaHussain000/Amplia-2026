import { Router } from "express";
import { IsAuth } from "../middleware/isAuth";
import { User } from "../models/user";
import { Request, Response, NextFunction } from "express";

const router = Router();

// Get all users (admin only)
router.get('/users', IsAuth.everyone, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({ isDeleted: { $ne: true } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/users/:id', IsAuth.everyone, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Update user
router.put('/users/:id', IsAuth.everyone, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, status, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, status, role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Delete user (soft delete)
router.delete('/users/:id', IsAuth.everyone, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Dashboard stats
router.get('/stats', IsAuth.everyone, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await User.countDocuments({ isDeleted: { $ne: true } });

    // Import models dynamically to avoid circular dependencies
    const { Service } = await import('../models/services');
    const { Category } = await import('../models/category');
    const { Booking } = await import('../models/booking');

    const totalServices = await Service.countDocuments({ isDeleted: { $ne: true } });
    const totalCategories = await Category.countDocuments({ isDeleted: { $ne: true } });
    const totalBookings = await Booking.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        users: totalUsers,
        services: totalServices,
        categories: totalCategories,
        bookings: totalBookings,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;