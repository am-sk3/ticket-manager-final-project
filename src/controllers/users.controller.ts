/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';
import UsersRepository from '../repositories/users.repository';
import User from '../models/User';
import { createHash } from 'crypto';

class UsersController {
    public async getAll(req: Request, res: Response): Promise<Response> {
        const { tokenRefresh } = res.locals;

        try {
            const query = await UsersRepository.getAll();
            return res.status(200).json({ tokenRefresh, message: query });
        } catch (error) {
            if (error.code == 'ECONNREFUSED') {
                error.message = 'Error connecting to DB';
                return res
                    .status(500)
                    .json({ tokenRefresh, error: error.message });
            }
            return res.status(400).json({ tokenRefresh, error: error.message });
        }
    }

    public async getById(req: Request, res: Response): Promise<Response> {
        const { tokenRefresh } = res.locals;
        const { id } = req.params;

        // if (res.locals.decodedToken.isAdmin == false) {
        //     if (id != res.locals.decodedToken.user_id) {
        //         return res.status(403).json({ message: 'Forbidden' });
        //     }
        // }

        try {
            const query = await UsersRepository.byId(Number(id));
            if (res.locals.decodedToken.isAdmin === false) {
                query.isEnabled = undefined;
                query.isAdmin = undefined;
            }

            return res.status(200).json({ tokenRefresh, message: query });
        } catch (error) {
            if (error.code == 'ECONNREFUSED') {
                error.message = 'Error connecting to DB';
                return res
                    .status(500)
                    .json({ tokenRefresh, error: error.message });
            }
            return res.status(400).json({ tokenRefresh, error: error.message });
        }
    }

    public async createUser(req: Request, res: Response): Promise<Response> {
        const { tokenRefresh } = res.locals;
        const user = new User(req.body);

        try {
            const query = await UsersRepository.create(user);
            return res
                .status(201)
                .json({ tokenRefresh, message: 'user created ' });
        } catch (error) {
            if (error.code == 'ECONNREFUSED') {
                error.message = 'Error connecting to DB';
                return res
                    .status(500)
                    .json({ tokenRefresh, error: error.message });
            }
            return res.status(400).json({ tokenRefresh, error: error.message });
        }
    }

    public async editUser(req: Request, res: Response): Promise<Response> {
        const { tokenRefresh } = res.locals;
        const user = new User(req.body);
        /**
         * verification for non admin users
         * only admins can change password from this service.
         */
        if (user.password !== undefined) {
            user.password = createHash('sha256')
                .update(user.password)
                .digest('hex');
        }
        if (res.locals.decodedToken.isAdmin == false) {
            user.isAdmin = undefined;
            user.isEnabled = undefined;
            user.password = undefined;
        }
        try {
            const query = await UsersRepository.update(
                user,
                Number(req.params.id)
            );
            if (query === 1) {
                return res
                    .status(200)
                    .json({ tokenRefresh, message: 'user updated' });
            }
            return res
                .status(200)
                .json({ tokenRefresh, message: 'user not updated' });
        } catch (error) {
            if (error.code == 'ECONNREFUSED') {
                error.message = 'Error connecting to DB';
                return res
                    .status(500)
                    .json({ tokenRefresh, error: error.message });
            }
            return res.status(400).json({ tokenRefresh, error: error.message });
        }
    }

    public async removeUser(req: Request, res: Response): Promise<Response> {
        const { tokenRefresh } = res.locals;
        const { id } = req.params;
        try {
            const query = await UsersRepository.delete(Number(id));
            return res
                .status(200)
                .json({ tokenRefresh, message: 'User removed' });
        } catch (error) {
            if (error.code == 'ECONNREFUSED') {
                error.message = 'Error connecting to DB';
                return res
                    .status(500)
                    .json({ tokenRefresh, error: error.message });
            }
            return res.status(400).json({ tokenRefresh, error: error.message });
        }
    }

    public async changePassword(
        req: Request,
        res: Response
    ): Promise<Response> {
        const { tokenRefresh } = res.locals;
        const { newPassword } = req.body;

        const userId = res.locals.decodedToken.user_id;
        const encPassword = createHash('sha256')
            .update(newPassword)
            .digest('hex');
        try {
            const query = await UsersRepository.changePassword(
                userId,
                encPassword
            );

            return res.json({ tokenRefresh, message: 'Password changed!' });
        } catch (error) {
            if (error.code == 'ECONNREFUSED') {
                error.message = 'Error connecting to DB';
                return res
                    .status(500)
                    .json({ tokenRefresh, error: error.message });
            }
            return res.status(400).json({ tokenRefresh, error: error.message });
        }
    }
}

export default new UsersController();
