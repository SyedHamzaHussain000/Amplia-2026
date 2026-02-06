export interface SendMailOptions {
  to: string;
  subject: string;
  otp: string;
  name: string;
  templatePath: string;
}

export interface JwtPayload {
  _id: string;
  email: string,
  role: string
}

export interface SanitizeOptions {
  keep?: string[];
  remove?: string[];
}

export interface IGetChatPopulate {
  withUser?: boolean;
  withAdmin?: boolean;
  withMessages?: boolean;
  withResolved?: boolean;
  withActiveSubAdmin?: boolean;
}

export interface IGetMessagePopulate {
  withSender?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      _id: string;
      email: string;
      role: string;
    }
  }
}

