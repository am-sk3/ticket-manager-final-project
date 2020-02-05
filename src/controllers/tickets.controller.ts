import { Request, Response } from 'express';
import TicketsRepository from "../repositories/tickets.repository";

class TicketsController {
    
    public async getAll(req: Request, res: Response): Promise<Response> {
    
        const tickets = await TicketsRepository.getAllTickets();
        return res.json( { tickets });
    }

    public async createTicket(req: Request, res: Response): Promise<Response> {
        return res.json();
    }

    public async updateTicket(req: Request, res: Response): Promise<Response> {
        return res.json();
    }

    public async getTicket(req: Request, res: Response): Promise<Response> {
        return res.json();
    }

    public async removeTicket(req: Request, res: Response): Promise<Response> {
        return res.json();
    }
    
    public async createComment(req: Request, res: Response): Promise<Response> {
        return res.json();
    }
    
}

export default new TicketsController();