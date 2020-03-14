import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret: string = String(process.env.SECRET_KEY);

export default class TokenMiddleware {
    public static async tokenVerify(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> {
        const allowedPaths = ['/', '/api/auth/login', '/api/auth/register'];

        if (allowedPaths.includes(req.path)) {
            return next();
        }

        if (!req.headers.authorization) {
            return res.status(403).json({
                code: 403,
                message: 'No credentials sent!'
            });
        }

        try {
            const token = req.headers.authorization.split('Bearer ')[1];
            res.locals.decodedToken = verify(token, secret);
            return next();
        } catch (err) {
            return res.status(403).json({
                code: 403,
                message: 'Invalid token!'
            });
        }
    }
}
