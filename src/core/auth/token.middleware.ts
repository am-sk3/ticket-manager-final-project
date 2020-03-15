import { Request, Response, NextFunction } from 'express';
import { verify, sign } from 'jsonwebtoken';
import dotenv from 'dotenv';
import UsersRepository from '../../repositories/users.repository';

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

            if (res.locals.decodedToken.user_id !== undefined) {
                const userEnabled = await UsersRepository.isEnabled(
                    Number(res.locals.decodedToken.user_id)
                );
                if (!userEnabled) {
                    throw new Error('invalid user');
                }
            }
            res.locals.tokenRefresh = sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 60 * 10,
                    username: res.locals.decodedToken.email,
                    user_id: res.locals.decodedToken.user_id,
                    isAdmin: res.locals.decodedToken.isAdmin
                },
                secret
            );
            return next();
        } catch (err) {
            return res.status(403).json({
                code: 403,
                message: 'Invalid token!'
            });
        }
    }
}
