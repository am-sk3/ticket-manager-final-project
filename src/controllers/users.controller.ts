/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';
import UsersRepository from '../repositories/users.repository';
import User from '../models/User';

class UsersController {
    public async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const query = await UsersRepository.getAll();
            return res.status(200).json({ message: query });
        } catch (error) {
            if (error.code == 'ECONNREFUSED') {
                error.message = 'Error connecting to DB';
                return res.status(500).json({
                    error: error.message
                });
            }
            return res.status(400).json({
                error: error.message
            });
        }
    }

    public async getById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const query = await UsersRepository.byId(Number(id));
            if (res.locals.decodedToken.isAdmin === false) {
                query.isEnabled = undefined;
                query.isAdmin = undefined;
            }

            return res.status(200).json({ message: query });
        } catch (error) {
            if (error.code == 'ECONNREFUSED') {
                error.message = 'Error connecting to DB';
                return res.status(500).json({
                    error: error.message
                });
            }
            return res.status(400).json({
                error: error.message
            });
        }
    }

    public async createUser(req: Request, res: Response): Promise<Response> {
        const user = new User(req.body);

        try {
            const query = await UsersRepository.create(user);
            console.log(query);
            return res.status(201).json({ message: 'user created ' });
        } catch (error) {
            if (error.code == 'ECONNREFUSED') {
                error.message = 'Error connecting to DB';
                return res.status(500).json({
                    error: error.message
                });
            }
            return res.status(400).json({
                error: error.message
            });
        }
    }

    public async editUser(req: Request, res: Response): Promise<Response> {
        const user = new User(req.body);
        /**
         * verification for non admin users
         * only admins can change password from this service.
         */
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
                return res.status(200).json({ message: 'user updated' });
            }
            return res.status(200).json({ message: 'user not updated' });
        } catch (error) {
            if (error.code == 'ECONNREFUSED') {
                error.message = 'Error connecting to DB';
                return res.status(500).json({
                    error: error.message
                });
            }
            return res.status(400).json({
                error: error.message
            });
        }
        return res.json();
    }

    public async removeUser(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const query = await UsersRepository.delete(Number(id));
            return res.status(200).json({ message: 'ok' });
        } catch (error) {
            if (error.code == 'ECONNREFUSED') {
                error.message = 'Error connecting to DB';
                return res.status(500).json({
                    error: error.message
                });
            }
            return res.status(400).json({
                error: error.message
            });
        }
    }

    public async changePassword(
        req: Request,
        res: Response
    ): Promise<Response> {
        const { newPassword } = req.body;

        const userId = res.locals.decodedToken.user_id;
        try {
            const query = await UsersRepository.changePassword(
                userId,
                newPassword
            );

            return res.json({ message: 'Password changed!' });
        } catch (error) {
            if (error.code == 'ECONNREFUSED') {
                error.message = 'Error connecting to DB';
                return res.status(500).json({
                    error: error.message
                });
            }
            return res.status(400).json({
                error: error.message
            });
        }
    }
}

export default new UsersController();
