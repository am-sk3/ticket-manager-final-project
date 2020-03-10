/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';
import UsersRepository from '../repositories/users.repository';
import User from '../models/User';
import { cat } from 'shelljs';

class UsersController {
    public async getAll(req: Request, res: Response): Promise<Response> {
        // console.log(typeof query);
        // console.log(query);
        try {
            const query = await UsersRepository.getAll();
            return res.status(200).json(query);
        } catch (error) {
            return res.status(200).json({ message: error.message });
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

            return res.status(200).json(query);
        } catch (error) {
            return res.status(200).json({ message: error.message });
        }
    }

    public async createUser(req: Request, res: Response): Promise<Response> {
        // const user: User ;
        const user = new User(req.body);

        // user.id_company = companyID;
        // user.is_admin = isAdmin;
        // user.is_enabled = isEnabled;

        // console.log(user);
        try {
            const query = await UsersRepository.create(user);

            return res.status(201).json({ message: 'user created ' });
        } catch (error) {
            return res.status(200).json({ message: error.message });
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
        // console.log(res.locals.decodedToken.isAdmin);
        // console.log(user.isAdmin);
        try {
            // const query = await UsersRepository.update(user);
            const query = await UsersRepository.update(
                user,
                Number(req.params.id)
            );
            // res.json({ query });
            if (query === 1) {
                return res.status(200).json({ message: 'user updated' });
            }
            return res.status(200).json({ message: 'user not updated' });
        } catch (error) {
            res.json({ message: error });
        }
        return res.json();
    }

    public async removeUser(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const query = await UsersRepository.delete(Number(id));
        return res.status(200).json({ message: 'ok' });
    }

    public async changePassword(
        req: Request,
        res: Response
    ): Promise<Response> {
        const { newPassword } = req.body;

        const userId = res.locals.decodedToken.user_id;
        // console.log(newPassword, userId);
        try {
            const query = await UsersRepository.changePassword(
                userId,
                newPassword
            );

            return res.json({ message: 'Password changed!' });
        } catch (error) {
            return res.json({ message: error });
        }
        // res.status(204).json();
    }

    public async getByEmail(email: string): Promise<any> {
        try {
            const query = await UsersRepository.byEmail(email);
            return query;
        } catch (error) {
            return false;
        }
    }
}

export default new UsersController();
