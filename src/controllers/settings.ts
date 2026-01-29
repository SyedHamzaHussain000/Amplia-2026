import { Request, Response, NextFunction } from 'express';
import Settings, { DEFAULT_US_TAX_BRACKETS } from '../models/settings';

// Get tax brackets (public endpoint for mobile app)
export const getTaxBrackets = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Try to get from database first
    const taxSettings = await Settings.findOne({ key: 'tax_brackets' });

    if (taxSettings) {
      res.status(200).json({
        success: true,
        taxBrackets: taxSettings.value,
        updatedAt: taxSettings.updatedAt,
      });
      return;
    }

    // Return default brackets if not in database
    res.status(200).json({
      success: true,
      taxBrackets: DEFAULT_US_TAX_BRACKETS,
      isDefault: true,
    });
  } catch (error) {
    next(error);
  }
};

// Update tax brackets (admin only)
export const updateTaxBrackets = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { taxBrackets } = req.body;
    const adminId = (req as any).userId;

    if (!taxBrackets) {
      res.status(400).json({
        success: false,
        message: 'Tax brackets data is required',
      });
      return;
    }

    // Validate tax brackets structure
    const years = Object.keys(taxBrackets);
    for (const year of years) {
      const filingStatuses = taxBrackets[year];
      if (!filingStatuses.single || !Array.isArray(filingStatuses.single)) {
        res.status(400).json({
          success: false,
          message: `Invalid tax brackets structure for year ${year}`,
        });
        return;
      }
    }

    // Upsert tax brackets
    const result = await Settings.findOneAndUpdate(
      { key: 'tax_brackets' },
      {
        key: 'tax_brackets',
        value: taxBrackets,
        description: 'US Federal Tax Brackets by Year and Filing Status',
        category: 'tax',
        updatedBy: adminId,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Tax brackets updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get all settings (admin only)
export const getAllSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category } = req.query;
    
    const query: any = {};
    if (category) {
      query.category = category;
    }

    const settings = await Settings.find(query)
      .populate('updatedBy', 'name email')
      .sort({ category: 1, key: 1 });

    res.status(200).json({
      success: true,
      count: settings.length,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single setting by key
export const getSetting = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { key } = req.params;

    const setting = await Settings.findOne({ key })
      .populate('updatedBy', 'name email');

    if (!setting) {
      res.status(404).json({
        success: false,
        message: `Setting with key '${key}' not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    next(error);
  }
};

// Update or create a setting (admin only)
export const upsertSetting = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { key, value, description, category } = req.body;
    const adminId = (req as any).userId;

    if (!key || value === undefined) {
      res.status(400).json({
        success: false,
        message: 'Key and value are required',
      });
      return;
    }

    const setting = await Settings.findOneAndUpdate(
      { key },
      {
        key,
        value,
        description: description || '',
        category: category || 'general',
        updatedBy: adminId,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: setting ? 'Setting updated' : 'Setting created',
      data: setting,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a setting (admin only)
export const deleteSetting = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { key } = req.params;

    const setting = await Settings.findOneAndDelete({ key });

    if (!setting) {
      res.status(404).json({
        success: false,
        message: `Setting with key '${key}' not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Setting deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Initialize default settings
export const initializeDefaultSettings = async (): Promise<void> => {
  try {
    // Check if tax brackets exist
    const taxBrackets = await Settings.findOne({ key: 'tax_brackets' });
    
    if (!taxBrackets) {
      await Settings.create({
        key: 'tax_brackets',
        value: DEFAULT_US_TAX_BRACKETS,
        description: 'US Federal Tax Brackets by Year and Filing Status',
        category: 'tax',
      });
      console.log('✅ Default tax brackets initialized');
    }

    // Add other default settings as needed
    const defaultSettings = [
      {
        key: 'app_name',
        value: 'Amplia',
        description: 'Application name',
        category: 'general',
      },
      {
        key: 'support_email',
        value: 'support@amplia.com',
        description: 'Support email address',
        category: 'general',
      },
      {
        key: 'booking_cancellation_hours',
        value: 24,
        description: 'Hours before booking that cancellation is allowed',
        category: 'general',
      },
    ];

    for (const setting of defaultSettings) {
      await Settings.findOneAndUpdate(
        { key: setting.key },
        setting,
        { upsert: true }
      );
    }

  } catch (error) {
    console.error('Error initializing default settings:', error);
  }
};
