import queryBuilder from '../core/db';
import moment = require('moment');

export default class TicketsRepository {
    
    public static async getAllTickets(search?: string, page?: number): Promise<any> {
        // const subquery = queryBuilder
        //     .select('')
        return queryBuilder
        .select('*')
        .from('tickets')
        .orderBy('creation_date', 'desc');
        
        // return queryBuilder
        // .select('subject', 'content', 'status', 'companies.name' as 'companyName', 'users.name', 'tickets.creation_date')
        // .from('tickets')
        // .join('companies', 'companies.id', 'tickets.id_company')
        // .join('users', 'users.id', 'tickets.id_user')
        // .orderBy('creation_date', 'desc');
    }

    public static async getOneTicket(ticketId: number): Promise<any> {
        return queryBuilder
                .select()
                .from('tickets')
                .where('id', '=', ticketId)
                .first();
    }

    public static async createTicket(subject: string, content: string, userId: number, companyId: number): Promise<number[]> {
        return queryBuilder
            .insert({
                id_user: userId,
                subject,
                content,
                id_company: companyId
            }).into('tickets');
    }

    public static async update(subject: string, content: string, ticketId: number, userId: number): Promise<number> {
        return queryBuilder('tickets')
            .where({id: ticketId})    
            .update({
                last_update_user: userId,
                subject,
                content,
                last_update: moment().format('YYYY-MM-DD h:mm:ss')
            })
    }

    public static async delete(ticketId: number): Promise<number> {
        return queryBuilder('tickets')
            .where({id: ticketId})    
            .update({
                is_deleted: true
            })
    }

    public static async comment(content: string, userId: number, ticketId: number): Promise<number[]> {
        return queryBuilder.insert({
            id_user: userId,
            id_ticket: ticketId,
            content
        }).into('comments');
    }
}
