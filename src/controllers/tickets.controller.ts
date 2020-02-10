import { Request, Response } from 'express';
import TicketsRepository from "../repositories/tickets.repository";

class TicketsController {
    
    public async getAll(req: Request, res: Response): Promise<Response> {
    
        const tickets = await TicketsRepository.getAllTickets();
        return res.json({ tickets });
    }

    public async create(req: Request, res: Response): Promise<Response> {
        const { subject, content, id_company } = req.body;
        
        const { user_id } = res.locals.decodedToken;
        const [ticketId] = await TicketsRepository.createTicket(subject, content, user_id, id_company);
        
        return res.json({ ticketId });
    }

    public async getTicket(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const ticket = await TicketsRepository.getOneTicket(Number(id));

        if (!ticket) {
            return res.status(404).json({
                message: 'Ticket not found!'
            });
        }
        return res.json({ ticket });
    }
    
    public async updateTicket(req: Request, res: Response): Promise<Response> {
        const { subject, content } = req.body;
        const { user_id } = res.locals.decodedToken;
        const { id } = req.params

        const ticketId = await TicketsRepository.update(subject, content, Number(id), user_id);

            if (!ticketId) {
                return res.status(404).json({
                    message: 'Ticket you want to update does not exist!'
                });
            }

        return res.json({ ticketId });
    }

    public async removeTicket(req: Request, res: Response): Promise<Response> {
        const { id } = req.params

        const ticketId = await TicketsRepository.delete(Number(id));
    
        if (!ticketId) {
            return res.status(404).json({
                message: 'Ticket you want to remove does not exist!'
            });
        }

        return res.json({ ticketId });
    }
    
    public async createComment(req: Request, res: Response): Promise<Response> {
        const { content, id_ticket } = req.body;
        const { user_id } = res.locals.decodedToken;
        
        try {
        const [commentId] = await TicketsRepository.comment(content, user_id, id_ticket);
        return res.json({ commentId });    
    
        } catch (err) {
                return res.status(404).json({
                    message: 'Ticket you want to comment does not exist!'
                });
            }
        
    }
}

export default new TicketsController();
