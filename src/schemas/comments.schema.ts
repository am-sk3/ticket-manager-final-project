import { Model, snakeCaseMappers } from 'objection';
import Users from './users.schema';
import Tickets from './tickets.schema';

class Comments extends Model {
    id?: number;

    idUser?: number;

    content?: string;

    idTicket?: number;

    // idCompany?: number;

    // isDeleted?: boolean;

    // lastUpdateUser?: string;

    // lastUpdate?: Date;

    static get tableName() {
        return 'comments';
    }

    static columnNameMappers = snakeCaseMappers();

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: 'comments.id_user',
                    to: 'users.id'
                }
            },
            ticket: {
                relation: Model.BelongsToOneRelation,
                modelClass: Tickets,
                join: {
                    from: 'tickets.id_user',
                    to: 'users.id'
                }
            }
        };
    }
}

export default Comments;
