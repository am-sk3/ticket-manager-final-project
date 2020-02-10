/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';
import UsersRepository from '../repositories/users.repository';
import User from '../models/User';

class UsersController {
    public async getAll(req: Request, res: Response): Promise<Response> {
        const query = await UsersRepository.getAll();
        // console.log(typeof query);
        console.log(query);
        return res.status(200).json(query);
    }

    public async getById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const query = await UsersRepository.byId(Number(id));
        return res.status(200).json(query);
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
        // user.id = undefined;

        try {
            // const query = await UsersRepository.update(user);
            const query = await UsersRepository.update(
                user,
                Number(req.params.id)
            );
            // res.json({ query });
            if (query === 1) {
                return res.status(200).json('user updated');
            }
            return res.status(200).json('user not updated');
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
}

export default new UsersController();
