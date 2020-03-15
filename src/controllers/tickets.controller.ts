import { Request, Response } from 'express';
import TicketsRepository from '../repositories/tickets.repository';
import Ticket from '../models/Ticket';
import { now } from 'moment';
import CompaniesRepository from '../repositories/companies.repository';

class TicketsController {
    public async getAll(req: Request, res: Response): Promise<Response> {
        try {
            let tickets;
            if (res.locals.decodedToken.isAdmin === false) {
                tickets = await TicketsRepository.getAllTicketsByUser(
                    Number(res.locals.decodedToken.user_id)
                );
            } else {
                tickets = await TicketsRepository.getAllTickets();
            }

            if (tickets && Object.keys(tickets).length > 0) {
                return res.status(200).json(tickets);
            }
            return res.status(201).json({ error: 'No tickets found' });
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

    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const ticket = new Ticket(req.body);
            ticket.idUser = res.locals.decodedToken.user_id;
            ticket.lastUpdateUser = res.locals.decodedToken.user_id;

            if (ticket.idCompany !== undefined && ticket.idUser !== undefined) {
                const companyValidation = await CompaniesRepository.searchByUser(
                    ticket.idCompany,
                    ticket.idUser
                );

                if (!companyValidation) {
                    return res.status(401).json({ error: 'Invalid company' });
                }
            }
            const query = await TicketsRepository.createTicket(ticket);

            return res.status(201).json({
                message: `ticket created with id ${query.id}`
            });
        } catch (error) {
            if (error.code == 'ECONNREFUSED') {
                error.message = 'Error connecting to DB';
                return res.status(500).json({
                    error: error.message
                });
            }
            if (error.code == 'ER_BAD_FIELD_ERROR') {
                error.message = 'Validation error. Unknown parameter';
            }
            return res.status(400).json({
                error: error.message
            });
        }
    }

    public async getTicket(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            let ticket;
            if (res.locals.decodedToken.isAdmin == false) {
                ticket = await TicketsRepository.getOneTicketUser(
                    Number(id),
                    Number(res.locals.decodedToken.user_id)
                );
            } else {
                ticket = await TicketsRepository.getOneTicket(Number(id));
            }

            if (!ticket) {
                return res.status(404).json({
                    message: 'Ticket not found!'
                });
            }
            return res.status(200).json(ticket);
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

    public async updateTicket(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            // * verification if ticket exists
            if (parseInt(id) > 0 && id !== undefined) {
                const ticketVerification = await TicketsRepository.getOneTicket(
                    Number(id)
                );

                if (ticketVerification && ticketVerification.idCompany) {
                    // * if it's not an admin user
                    const { user_id } = res.locals.decodedToken;
                    if (res.locals.decodedToken.isAdmin === false) {
                        // * verify if user belongs to the company

                        const companyValidation = await CompaniesRepository.searchByUser(
                            ticketVerification.idCompany,
                            user_id
                        );

                        if (companyValidation) {
                            let subject = req.body.subject;
                            let content = req.body.content;

                            if (subject === undefined) {
                                subject = ticketVerification.subject;
                            }
                            if (content === undefined) {
                                content = ticketVerification.content;
                            }

                            const idCompany = ticketVerification.idCompany;

                            const ticket = new Ticket({
                                id: Number(id),
                                idUser: Number(user_id),
                                idCompany,
                                subject,
                                content
                            });

                            // ticket.idUser = user_id;

                            const query = await TicketsRepository.update(
                                ticket,
                                Number(req.params.id)
                            );

                            if (query === 1) {
                                return res.status(200).json({
                                    message: `Ticket ${Number(
                                        req.params.id
                                    )} updated`
                                });
                            }
                        }
                    } else {
                        let subject = req.body.subject;
                        let content = req.body.content;
                        let idCompany = req.body.idCompany;

                        if (subject === undefined) {
                            subject = ticketVerification.subject;
                        }
                        if (content === undefined) {
                            content = ticketVerification.content;
                        }
                        if (idCompany === undefined) {
                            idCompany = ticketVerification.idCompany;
                        }

                        // const idCompany = ticketVerification.idCompany;
                        const companyValidation = await CompaniesRepository.byId(
                            Number(idCompany),
                            true
                        );
                        if (Object.keys(companyValidation).length > 0) {
                            const ticket = new Ticket({
                                id: Number(id),
                                idUser: Number(user_id),
                                idCompany,
                                subject,
                                content
                            });

                            // ticket.idUser = user_id;

                            const query = await TicketsRepository.update(
                                ticket,
                                Number(req.params.id)
                            );

                            if (query === 1) {
                                return res.status(200).json({
                                    message: `Ticket ${Number(
                                        req.params.id
                                    )} updated`
                                });
                            }
                        }
                        return res.status(400).json({
                            message: 'Invalid Company ID!'
                        });
                    }

                    // console.log(ticket);
                    // if (ticketVerification) {

                    // }
                }
            }
            return res.status(400).json({
                message: 'Invalid Ticket!'
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

    public async removeTicket(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = res.locals.decodedToken;

        if (res.locals.decodedToken.isAdmin == true) {
            try {
                const query = await TicketsRepository.delete(
                    Number(id),
                    Number(userId)
                );

                if (!query) {
                    return res.status(404).json({
                        message: 'Ticket you want to remove does not exist!'
                    });
                }
                return res
                    .status(200)
                    .json({ message: [`Ticket ${Number(id)} deleted`] });
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
        return res.status(204).json();
    }

    public async createComment(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const idTicket = Number(id);
        const { content } = req.body;
        const { user_id, isAdmin } = res.locals.decodedToken;
        try {
            // console.log('here');
            if (isAdmin == false) {
                const ticketVerification = await TicketsRepository.getOneTicketUser(
                    idTicket,
                    user_id
                );

                if (!ticketVerification) {
                    return res.status(400).json({ error: 'Invalid ticket' });
                }
            }
            const commentId = await TicketsRepository.comment(
                content,
                user_id,
                idTicket
            );
            // console.log(commentId);
            if (commentId) {
                await TicketsRepository.update({ status: 'Open' }, idTicket);
                return res.status(200).json({
                    message: `Comment with ID ${commentId.id} created.`
                });
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
        }
        return res.status(404).json({
            message: 'Ticket you want to comment does not exist!'
        });
    }

    public async closeTicket(req: Request, res: Response): Promise<Response> {
        const ticket = new Ticket(req.body);
        const { status } = req.body;
        ticket.lastUpdateUser = res.locals.decodedToken.user_id;

        try {
            const query = await TicketsRepository.markAsClosed(
                status,
                Number(req.params.id),
                Number(ticket.lastUpdateUser)
            );

            if (query === 1) {
                return res.status(200).json({
                    message: [`Ticket ${Number(req.params.id)} closed`]
                });
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
        }

        return res.status(200).json({
            message: 'Ticket not closed!'
        });
    }
}

export default new TicketsController();
