import { Model, snakeCaseMappers } from 'objection';
import Users from './users.schema';
import Companies from './companies.schema';

class Tickets extends Model {
    id?: number;

    subject?: string;

    content?: boolean;

    status?: string;

    idCompany?: number;

    isDeleted?: boolean;

    lastUpdateUser?: string;

    lastUpdate?: Date;

    static get tableName() {
        return 'tickets';
    }

    static columnNameMappers = snakeCaseMappers();

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: 'tickets.id_user',
                    to: 'users.id'
                }
            },
            company: {
                relation: Model.BelongsToOneRelation,
                modelClass: Companies,
                join: {
                    from: 'tickets.id_company',
                    to: 'companies.id'
                }
            }
        };
    }
}

export default Tickets;
