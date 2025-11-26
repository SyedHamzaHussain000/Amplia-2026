import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { jwtSecret } from '../config/env';
import { UserRole } from '../constants/roles';

const verifyToken = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            return res.status(401).json({ success: false, message: '*Not authenticated.' });
        }

        const token = authHeader.split(' ')[1];

        try {
            if (!jwtSecret) throw new Error('JWT_SECRET not set in .env');

            const decoded = jwt.verify(token, jwtSecret) as JwtPayload & {
                _id: string;
                email: string;
                role: string;
            };

            req._id = decoded._id;
            req.email = decoded.email;
            req.role = decoded.role;

            if (allowedRoles.length && !allowedRoles.includes(req.role)) {
                return res.status(403).json({ success: false, message: 'Access denied.' });
            }

            next();
        } catch (error) {
            console.error('JWT error:', error);
            return res.status(401).json({ success: false, message: '*Not authenticated.' });
        }
    };
};

export const IsAuth = {
    users: verifyToken([UserRole.USER]),             // normal user only
    admins: verifyToken([UserRole.SUPER_ADMIN, UserRole.SUB_ADMIN]), // both admins
    superAdmin: verifyToken([UserRole.SUPER_ADMIN]), // only super-admin
    subAdmin: verifyToken([UserRole.SUB_ADMIN]),     // only sub-admin
    everyone: verifyToken([UserRole.USER , UserRole.SUPER_ADMIN, UserRole.SUB_ADMIN]),     // only sub-admin
};

