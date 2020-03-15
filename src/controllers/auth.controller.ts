import { Request, Response } from 'express';
import AuthRepository from '../repositories/auth.repository';
import { createHash } from 'crypto';
import Users from '../schemas/users.schema';

class AuthController {
    public static async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;
            const encPassword = createHash('sha256')
                .update(password)
                .digest('hex');
            if (!email || !password) {
                return res.status(402).json({
                    message: 'email and password are required for login'
                });
            }
            const token = await AuthRepository.attemptLogin(email, encPassword);

            return res.json({ token });
        } catch (error) {
            if (error.code == 'ECONNREFUSED') {
                error.message = 'Error connecting to DB';
                return res.status(500).json({
                    error: error.message
                });
            }
            return res.status(401).json({
                error: error.message
            });
        }
    }

    public static async register(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const { email, name, password } = req.body;

            const encPassword = createHash('sha256')
                .update(password)
                .digest('hex');

            const userVerification = await Users.query()
                .select('id')
                .where('email', email)
                .first();

            if (!userVerification) {
                const userId = await AuthRepository.register(
                    name,
                    email,
                    encPassword
                );

                // if (userId) {
                //     const token = await AuthRepository.attemptLogin(
                //         email,
                //         encPassword
                //     );
                //     return res.json({ token });
                // }
            }

            return res.status(400).json({ error: 'user already exists' });
        } catch (error) {
            if (error.code == 'ECONNREFUSED') {
                error.message = 'Error connecting to DB';
                return res.status(500).json({
                    error: error.message
                });
            }
            return res.status(401).json({
                error: error.message
            });
        }
    }
}

export default AuthController;
