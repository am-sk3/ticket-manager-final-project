import { Request, Response } from 'express';
import AuthRepository from '../repositories/auth.repository';
class AuthController {

    public async login(req: Request, res: Response): Promise<Response> {
        return res.json();
    }

    public async register(req: Request, res: Response): Promise<Response> {
        return res.json();
    }

    public async logout(req: Request, res: Response): Promise<Response> {
        return res.json();
    }
    
    
    
}

export default new AuthController();