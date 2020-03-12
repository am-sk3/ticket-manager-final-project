import moment = require('moment');
import Tickets from '../schemas/tickets.schema';
import Ticket from '../models/Ticket';
import Comments from '../schemas/comments.schema';
import Users from '../schemas/users.schema';

export default class TicketsRepository {
    public static async getAllTickets(): Promise<Tickets[]> {
        return Tickets.query().select();
    }

    public static async getAllTicketsByUser(userId: number): Promise<any> {
        const query = await Tickets.query()
            .select()
            .where('is_deleted', false)
            .whereIn(
                'id_company',
                Users.relatedQuery('companies')
                    .select('id')
                    .for(userId)
            );
        // console.log(query);
        return query;
    }

    public static async getOneTicket(
        ticketId: number,
        isDeleted?: false
    ): Promise<Tickets> {
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
            .where({
                id: ticketId,
                isDeleted
                // 'id', '=', ticketId,'is_deleted'
            })
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
