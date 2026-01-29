import mongoose, { Schema, Document } from 'mongoose';

// Tax Bracket Interface
interface ITaxBracket {
  min: number;
  max: number;
  rate: number;
  base: number;
}

// Tax Year Configuration
interface ITaxYear {
  year: string;
  filingStatuses: {
    single: ITaxBracket[];
    married_jointly: ITaxBracket[];
    married_separately: ITaxBracket[];
    head_of_household: ITaxBracket[];
  };
}

// App Settings Interface
export interface ISettings extends Document {
  key: string;
  value: any;
  description: string;
  category: 'tax' | 'payment' | 'notification' | 'general';
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Tax Settings Schema
const TaxBracketSchema = new Schema({
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  rate: { type: Number, required: true },
  base: { type: Number, required: true },
}, { _id: false });

const FilingStatusBracketsSchema = new Schema({
  single: [TaxBracketSchema],
  married_jointly: [TaxBracketSchema],
  married_separately: [TaxBracketSchema],
  head_of_household: [TaxBracketSchema],
}, { _id: false });

const TaxYearSchema = new Schema({
  year: { type: String, required: true },
  filingStatuses: FilingStatusBracketsSchema,
}, { _id: false });

// Main Settings Schema
const SettingsSchema = new Schema<ISettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['tax', 'payment', 'notification', 'general'],
      default: 'general',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Default US Tax Brackets for 2024 (Single Filer)
export const DEFAULT_US_TAX_BRACKETS = {
  '2024': {
    single: [
      { min: 0, max: 11600, rate: 0.10, base: 0 },
      { min: 11601, max: 47150, rate: 0.12, base: 1160 },
      { min: 47151, max: 100525, rate: 0.22, base: 5426 },
      { min: 100526, max: 191950, rate: 0.24, base: 17168.50 },
      { min: 191951, max: 243725, rate: 0.32, base: 39110.50 },
      { min: 243726, max: 609350, rate: 0.35, base: 55678.50 },
      { min: 609351, max: Infinity, rate: 0.37, base: 183647.25 },
    ],
    married_jointly: [
      { min: 0, max: 23200, rate: 0.10, base: 0 },
      { min: 23201, max: 94300, rate: 0.12, base: 2320 },
      { min: 94301, max: 201050, rate: 0.22, base: 10852 },
      { min: 201051, max: 383900, rate: 0.24, base: 34337 },
      { min: 383901, max: 487450, rate: 0.32, base: 78221 },
      { min: 487451, max: 731200, rate: 0.35, base: 111357 },
      { min: 731201, max: Infinity, rate: 0.37, base: 196669.50 },
    ],
    married_separately: [
      { min: 0, max: 11600, rate: 0.10, base: 0 },
      { min: 11601, max: 47150, rate: 0.12, base: 1160 },
      { min: 47151, max: 100525, rate: 0.22, base: 5426 },
      { min: 100526, max: 191950, rate: 0.24, base: 17168.50 },
      { min: 191951, max: 243725, rate: 0.32, base: 39110.50 },
      { min: 243726, max: 365600, rate: 0.35, base: 55678.50 },
      { min: 365601, max: Infinity, rate: 0.37, base: 98334.75 },
    ],
    head_of_household: [
      { min: 0, max: 16550, rate: 0.10, base: 0 },
      { min: 16551, max: 63100, rate: 0.12, base: 1655 },
      { min: 63101, max: 100500, rate: 0.22, base: 7241 },
      { min: 100501, max: 191950, rate: 0.24, base: 15469 },
      { min: 191951, max: 243700, rate: 0.32, base: 37417 },
      { min: 243701, max: 609350, rate: 0.35, base: 53977 },
      { min: 609351, max: Infinity, rate: 0.37, base: 181954.50 },
    ],
  },
  '2023': {
    single: [
      { min: 0, max: 11000, rate: 0.10, base: 0 },
      { min: 11001, max: 44725, rate: 0.12, base: 1100 },
      { min: 44726, max: 95375, rate: 0.22, base: 5147 },
      { min: 95376, max: 182100, rate: 0.24, base: 16290 },
      { min: 182101, max: 231250, rate: 0.32, base: 37104 },
      { min: 231251, max: 578125, rate: 0.35, base: 52832 },
      { min: 578126, max: Infinity, rate: 0.37, base: 174238.25 },
    ],
    married_jointly: [
      { min: 0, max: 22000, rate: 0.10, base: 0 },
      { min: 22001, max: 89450, rate: 0.12, base: 2200 },
      { min: 89451, max: 190750, rate: 0.22, base: 10294 },
      { min: 190751, max: 364200, rate: 0.24, base: 32580 },
      { min: 364201, max: 462500, rate: 0.32, base: 74208 },
      { min: 462501, max: 693750, rate: 0.35, base: 105664 },
      { min: 693751, max: Infinity, rate: 0.37, base: 186601.50 },
    ],
    married_separately: [
      { min: 0, max: 11000, rate: 0.10, base: 0 },
      { min: 11001, max: 44725, rate: 0.12, base: 1100 },
      { min: 44726, max: 95375, rate: 0.22, base: 5147 },
      { min: 95376, max: 182100, rate: 0.24, base: 16290 },
      { min: 182101, max: 231250, rate: 0.32, base: 37104 },
      { min: 231251, max: 346875, rate: 0.35, base: 52832 },
      { min: 346876, max: Infinity, rate: 0.37, base: 93300.75 },
    ],
    head_of_household: [
      { min: 0, max: 15700, rate: 0.10, base: 0 },
      { min: 15701, max: 59850, rate: 0.12, base: 1570 },
      { min: 59851, max: 95350, rate: 0.22, base: 6868 },
      { min: 95351, max: 182100, rate: 0.24, base: 14678 },
      { min: 182101, max: 231250, rate: 0.32, base: 35498 },
      { min: 231251, max: 578100, rate: 0.35, base: 51226 },
      { min: 578101, max: Infinity, rate: 0.37, base: 172623.50 },
    ],
  },
};

const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
