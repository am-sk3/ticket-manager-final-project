import { Model, snakeCaseMappers } from 'objection';
import Users from './users.schema';

class Company extends Model {
    id?: number;

    name?: string;

    isDeleted?: boolean;

    static get tableName() {
        return 'companies';
    }

    static columnNameMappers = snakeCaseMappers();

    static get relationMappings() {
        return {
            users: {
                relation: Model.ManyToManyRelation,
                modelClass: Users,
                join: {
                    from: 'companies.id',
                    through: {
                        from: 'users_companies.id_company',
                        to: 'users_companies.id_user'
                    },
                    to: 'users.id'
                }
            }
        };
    }
}

export default Company;
