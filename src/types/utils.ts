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

declare global {
  namespace Express {
    interface Request {
      _id: string;
      email: string;
      role: string;
    }
  }
}

