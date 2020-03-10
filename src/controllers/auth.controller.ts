import { Request, Response } from 'express';
import AuthRepository from '../repositories/auth.repository';
class AuthController {
    public static async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(402).json({
                    message: 'email and password are required for login'
                });
            }
            const token = await AuthRepository.attemptLogin(email, password);

            return res.json({ token });
        } catch (err) {
            return res.status(401).json({
                message: err.message
            });
        }
    }

    public static async register(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const { email, name, password } = req.body;

            // Validacao de campos

            const userId = await AuthRepository.register(name, email, password);

            if (userId) {
                const token = await AuthRepository.attemptLogin(
                    email,
                    password
                );
                return res.json({ token });
            }

            return res.status(400).json();
        } catch (err) {
            return res.status(400).json({
                message: err.message
            });
        }
    }

    // public static async profile(req: Request, res: Response): Promise<Response> {
    //     const decodedToken = res.locals.decodedToken;
    //     const userId = decodedToken.user_id;

    //     const user = await UsersRepository.byId(userId);
    //     const info = await AuthRepository.getUserInfo(userId);

    //     delete user.password;

    //     return res.json({ user, info: info[0][0] });
    // }

    // public static async logout(req: Request, res: Response): Promise<Response> {
    //     return res.json();
    // }
}

export default AuthController;
