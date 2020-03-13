import { Request, Response } from 'express';
import TicketsRepository from '../repositories/tickets.repository';
import Ticket from '../models/Ticket';
import { now } from 'moment';

class TicketsController {
    public async getAll(req: Request, res: Response): Promise<Response> {
        let tickets;
        if (res.locals.decodedToken.isAdmin === false) {
            tickets = await TicketsRepository.getAllTicketsByUser(
                Number(res.locals.decodedToken.user_id)
            );
        } else {
            tickets = await TicketsRepository.getAllTickets();
        }

        return res.status(200).json(tickets);
    }

    public async create(req: Request, res: Response): Promise<Response> {
        const ticket = new Ticket(req.body);
        ticket.idUser = res.locals.decodedToken.user_id;
        ticket.lastUpdateUser = res.locals.decodedToken.user_id;

        try {
            const query = await TicketsRepository.createTicket(ticket);

            return res.status(201).json({ message: 'ticket created', query });
        } catch (error) {
            return res.status(200).json({ message: error.message });
        }
    }

    public async getTicket(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

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
    }

    public async updateTicket(req: Request, res: Response): Promise<Response> {
        const ticket = new Ticket(req.body);
        ticket.lastUpdateUser = res.locals.decodedToken.user_id;

        try {
            const query = await TicketsRepository.update(
                ticket,
                Number(req.params.id)
            );

            if (query === 1) {
                return res.status(200).json({
                    message: [`Ticket ${Number(req.params.id)} updated`]
                });
            }
            return res.status(200).json({
                message: 'Ticket not updated!'
            });
        } catch (error) {
            res.json({ message: error });
        }

        return res.json();
    }

    public async removeTicket(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = res.locals.decodedToken;
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
    }

    public async createComment(req: Request, res: Response): Promise<Response> {
        const { content, id_ticket } = req.body;
        const { user_id } = res.locals.decodedToken;

        try {
            const commentId = await TicketsRepository.comment(
                content,
                user_id,
                id_ticket
            );

            //
            // if([commentId]) {
            //     const { subject, content } = req.body;
            //     const { user_id } = res.locals.decodedToken;
            //     const { id } = req.params

            //     const ticketId = await TicketsRepository.update(subject, content, Number(id), user_id);

            //     return res.status(200).json({
            //         message: 'Ticket last_update_date and user was filled'
            //     });
            // }
            //

            return res
                .status(200)
                .json({ message: [`Comment with ID ${commentId} created.`] });
        } catch (err) {
            return res.status(404).json({
                message: 'Ticket you want to comment does not exist!'
            });
        }
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
            return res.status(200).json({
                message: 'Ticket not closed!'
            });
        } catch (error) {
            res.json({ message: error });
        }

        return res.json();
    }
    //     const ticketId = await TicketsRepository.markAsClosed(status, Number(id), Number(userId));

    //         if (!ticketId) {
    //             return res.status(404).json({
    //                 message: 'Ticket you want to close does not exist!'
    //             });
    //         }

    //     return res.status(200).json({ message: [`You closed ticket ${Number(id)}.`]});
    // }
}

export default new TicketsController();
