import { Model, snakeCaseMappers } from 'objection';
import Companies from './companies.schema';

class Users extends Model {
    id?: number;

    name?: string;

    email?: string;

    password?: string;

    createdAt?: Date;

    isAdmin?: boolean;

    isEnabled?: boolean;

    static get tableName() {
        return 'users';
    }

    static columnNameMappers = snakeCaseMappers();

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'email', 'password'],
            properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                isAdmin: { type: 'boolean' },
                isEnabled: { type: 'boolean' }
            }
        };
    }

    static get relationMappings() {
        return {
            companies: {
                relation: Model.ManyToManyRelation,
                modelClass: Companies,
                join: {
                    from: 'users.id',
                    through: {
                        from: 'users_companies.id_user',
                        to: 'users_companies.id_company'
                    },
                    to: 'companies.id'
                }
            }
        };
    }
}

export default Users;
