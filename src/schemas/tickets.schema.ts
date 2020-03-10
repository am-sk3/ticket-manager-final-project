import { Model, snakeCaseMappers } from 'objection';
import Users from './users.schema';

class Tickets extends Model {
    id?: number;

    subject?: string;

    content?: string;

    creationDate?: Date;

    status?: string;

    idUser?: number;

    closedDate?: Date;

    idCompany?: number;

    isDeleted?: boolean;

    lastUpdateUser?: number;

    lastUpdate?: Date;

    static get tableName() {
        return 'tickets';
    }

    static columnNameMappers = snakeCaseMappers();

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['subject', 'content', 'idUser', 'idCompany'],
            properties: {
                subject: { type: 'string' },
                content: { type: 'string' },
                status: { type: 'string' },
                idUser: { type: 'number'},
                idCompany: { type: 'number'},
                lastUpdateUser: { type: 'number'}
            }
        };
    }

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: 'ticket.id_user',
                    to: 'users.id'
                }
            }
        };
    }
}

export default Tickets;
