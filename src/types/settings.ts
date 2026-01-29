export interface ITaxBracket {
  min: number;
  max: number;
  rate: number;
  base: number;
}

export interface IFilingStatusBrackets {
  single: ITaxBracket[];
  married_jointly: ITaxBracket[];
  married_separately: ITaxBracket[];
  head_of_household: ITaxBracket[];
}

export interface ITaxBracketsByYear {
  [year: string]: IFilingStatusBrackets;
}

export interface ISettings {
  _id: string;
  key: string;
  value: any;
  description: string;
  category: 'tax' | 'payment' | 'notification' | 'general';
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateTaxBracketsRequest {
  taxBrackets: ITaxBracketsByYear;
}

export interface IUpsertSettingRequest {
  key: string;
  value: any;
  description?: string;
  category?: 'tax' | 'payment' | 'notification' | 'general';
}
