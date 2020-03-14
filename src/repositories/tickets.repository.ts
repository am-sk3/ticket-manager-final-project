import queryBuilder from '../core/db';
import moment = require('moment');
import Tickets from '../schemas/tickets.schema';
import Ticket from '../models/Ticket';
import Comments from '../schemas/comments.schema';

export default class TicketsRepository {
    public static async getAllTickets(
        search?: string,
        page?: number
    ): Promise<Tickets[]> {
        const query = Tickets.query().select(
            'id',
            'subject',
            'content',
            'status',
            'creation_date',
            'id_user',
            'id_company',
            'is_deleted',
            'last_update_user',
            'last_update'
        );

        return query;
    }

    public static async getOneTicket(ticketId: number): Promise<Tickets> {
        return Tickets.query()
            .select(
                'id',
                'subject',
                'content',
                'status',
                'creation_date',
                'id_user',
                'id_company',
                'is_deleted',
                'last_update_user',
                'last_update'
            )
            .where('id', '=', ticketId)
            .first();
    }

    public static async getTicketsByCompany(idCompany: number): Promise<Tickets> {
        return Tickets.query()
            .select(
                'id',
                'subject',
                'content',
                'status',
                'creation_date',
                'id_user',
                'id_company',
                'is_deleted',
                'last_update_user',
                'last_update'
            )
            .where('id_company', '=', idCompany)
            .first();
    }

    public static async createTicket(ticket: Ticket): Promise<Tickets> {
        return Tickets.query().insert(ticket);
    }

    public static async update(
        ticket: Ticket,
        ticketId: number
    ): Promise<Number> {
        console.log(ticketId);
        console.log(ticket);
        return Tickets.query()
            .findById(ticketId)
            .patch(ticket);
    }

    public static async delete(
        ticketId: number,
        userId: number
    ): Promise<Number> {
        return Tickets.query()
            .findById(ticketId)
            .patch({
                isDeleted: true
            });
        //  how to add other updates?
    }

    public static async comment(
        content: string,
        userId: number,
        ticketId: number
    ): Promise<Comments> {
        this.update({ status: 'Open' }, ticketId);
        return Comments.query().insert({
            idUser: userId,
            idTicket: ticketId,
            content
        });
        //  update tickets last_updated date and user
    }

    public static async markAsClosed(
        status: string,
        ticketId: number,
        userId: number
    ): Promise<number> {
        return Tickets.query()
            .findById(ticketId)
            .patch({
                status: 'Closed',
                lastUpdateUser: userId,
                closedDate: moment().toDate()
            });
        // return queryBuilder('tickets')
        //     .where({id: ticketId})
        //     .update({
        //         status: 'Closed',
        //         closed_date: moment().format('YYYY-MM-DD h:mm:ss'),
        //         last_update_user: userId,
        //         last_update:  moment().format('YYYY-MM-DD h:mm:ss')
        //     })
    }
}
