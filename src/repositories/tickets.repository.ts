import { queryBuilder } from '../core/db/index';

export default class TicketsRepository {
    
    public static async getAllTickets(search?: string, page?: number): Promise<any> {
        return queryBuilder
        .select('subject', 'content', 'creation_date', 'status', 'id_company')
        .from('tickets')
        .orderBy('tickets.creation_date', 'desc');
    }
}
