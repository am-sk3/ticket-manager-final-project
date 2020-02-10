import { Request, Response } from 'express';
import CompanyRepository from '../repositories/companies.repository';

class CompanyController {
    public async getAll(req: Request, res: Response): Promise<Response> {
        const allCompanies = await CompanyRepository.getAll();
        // console.log(allCompanies);
        return res.status(200).json({ allCompanies });
    }

    public async getById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const company = await CompanyRepository.byId(Number(id));
        // const users = await CompanyRepository.getAllUsers(Number(id));

        return res.status(200).json({
            company
            // users: users
        });
    }

    public async create(req: Request, res: Response): Promise<Response> {
        const { name } = req.body;
        const company = await CompanyRepository.create(name);
        // const [companyId] = await CompanyRepository.create(name);
        // console.log(query);

        return res.status(201).json({
            company

            // id: companyId,
            // name
        });
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { name } = req.body;
        const company = await CompanyRepository.update(Number(id), name);
        console.log(company);
        if (company === 1) {
            return res.status(202).json({
                company: Number(id),
                name
            });
        }
        return res.status(200).json({
            message: 'not updated'
        });
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const company = await CompanyRepository.delete(Number(id));

        return res.status(200).json({ message: 'Company deleted' });
    }

    public async addUser(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const { userId } = req.body;

        try {
            // * If an error is returned, it's probably a duplicate
            const query = await CompanyRepository.addUser(
                Number(id),
                Number(userId)
            );

            return res.json({ message: 'user was added to the company' });
        } catch (error) {
            return res.json({ message: 'client already exists' });
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const { userId } = req.body;

        /**
         * values:
         * 0 - not deleted
         * 1 - deleted
         */

        const query = await CompanyRepository.removeUser(
            Number(id),
            Number(userId)
        );

        // * hide status from response, not needed.
        return res
            .status(202)
            .json({ message: 'user was deleted from company' });
    }

    // public async listUsers(req: Request, res:Response): Promise<Response> {
    //     const { id } = req.params

    //     const { query } = await CompanyRepository.getAllUsers(Number(id));

    //     return
    // }
}

export default new CompanyController();
