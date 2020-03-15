import { Request, Response } from 'express';
import CompanyRepository from '../repositories/companies.repository';

class CompanyController {
    public async getAll(req: Request, res: Response): Promise<Response> {
        // console.log(res.locals.decodedToken);
        const { user_id, isAdmin } = res.locals.decodedToken;
        let allCompanies;
        try {
            if (isAdmin == false) {
                allCompanies = await CompanyRepository.byUserId(
                    Number(user_id)
                );
            } else {
                allCompanies = await CompanyRepository.getAll();
            }
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

            // console.log(allCompanies);
        }
        return res.status(200).json({ message: allCompanies });
    }

    public async getById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { user_id, isAdmin } = res.locals.decodedToken;
        try {
            if (isAdmin == false) {
                const isCompanyUser = await CompanyRepository.searchByUser(
                    Number(id),
                    Number(user_id)
                );
                if (isCompanyUser) {
                    const query = await CompanyRepository.byId(Number(id));

                    if (query) {
                        return res.status(200).json({ message: query });
                    }
                    return res.status(201).json({ error: 'Unknown company' });
                }
                return res.status(401).json({ error: 'Forbidden' });
            }
            const company = await CompanyRepository.byId(Number(id), true);

            return res.status(200).json({ message: company });
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
        // const users = await CompanyRepository.getAllUsers(Number(id));
    }

    public async create(req: Request, res: Response): Promise<Response> {
        const { name } = req.body;
        // const [companyId] = await CompanyRepository.create(name);
        // console.log(query);
        try {
            const company = await CompanyRepository.create(name);
            return res.status(201).json({ message: company });
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

    public async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { name } = req.body;
        try {
            const company = await CompanyRepository.update(Number(id), name);
            if (company === 1) {
                return res.status(202).json({
                    company: Number(id),
                    name
                });
            }
            return res.status(200).json({
                message: 'not updated'
            });
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

    public async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const company = await CompanyRepository.delete(Number(id));

            return res.status(200).json({ message: 'Company deleted' });
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

    public async addUser(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const { userId } = req.body;

        try {
            if (userId == undefined || parseInt(userId) === 0) {
                throw new Error('Field userId is mandatory');
            }
            if (parseInt(id) === 0) {
                throw new Error('Invalid Ticket ID');
            }

            // * If an error is returned, it's probably a duplicate
            const userVerification = await CompanyRepository.searchByUser(
                Number(id),
                Number(userId)
            );

            if (!userVerification) {
                const query = await CompanyRepository.addUser(
                    Number(id),
                    Number(userId)
                );

                return res
                    .status(201)
                    .json({ message: 'User was added to the company' });
            }
            return res
                .status(400)
                .json({ message: 'User already belongs to the Company' });
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
            // return res.json({ message: 'client already exists' });
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
        try {
            const query = await CompanyRepository.removeUser(
                Number(id),
                Number(userId)
            );

            // * hide status from response, not needed.
            return res
                .status(202)
                .json({ message: 'user was deleted from company' });
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

export default new CompanyController();
