import { Request, Response, NextFunction } from 'express';

class AuthLevel {
    public async verifyAdminUsers(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        const localToken = res.locals.decodedToken;
        // const adminPaths = '(/api/users).*|(/api/companies/).*';
        console.log(req.body);
        console.log(res.locals.decodedToken);
        console.log(req.path);

        if (localToken.isAdmin === false) {
            if (req.params.id != localToken.user_id) {
                return res.status(403).json({ message: 'Forbidden' });
            }
        }

        return next();
    }
}

export default new AuthLevel();
