// import { Model } from 'objection';
// import queryBuilder from '../core/db';
import Companies from '../schemas/companies.schema';

// import companyController from 'controllers/company.controller';
// import companyController from 'controllers/company.controller';
// Model.knex(queryBuilder);
export default class CompaniesRepository {
    public static async byId(companyId: number): Promise<Companies[]> {
        // return queryBuilder
        //     .select()
        //     .from('companies')
        //     .where({ id: companyId })
        //     .first();
        const query = Companies.query()
            .where({ id: companyId })
            .withGraphFetched('users(selectInfo)')
            .modifiers({
                selectInfo(builder) {
                    builder.select(
                        'id',
                        'name',
                        'email',
                        'created_at',
                        'is_enabled'
                    );
                }
            });
        // console.log();
        return query;
    }

    public static async getAll(): Promise<Companies[]> {
        // const sql = queryBuilder.from('companies');
        const query = Companies.query();
        // console.log(sql);
        return query;
    }

    public static async create(name: string): Promise<Companies> {
        // return queryBuilder
        //     .insert({
        //         name
        //     })
        //     .into('companies');
        return Companies.query().insert({ name });
        // .returning('id');
    }

    public static async delete(companyId: number): Promise<Number> {
        // return queryBuilder('companies')
        //     .where({ id: companyId })
        //     .update({ is_deleted: true });
        return Companies.query()
            .findById(companyId)
            .patch({ isDeleted: true });
    }

    public static async update(
        companyId: number,
        name: string
    ): Promise<Number> {
        // const query = queryBuilder
        //     .select('is_deleted')
        //     .from('companies')
        //     .where({ id: companyId });
        // isDeleted = Boolean(query);

        // return queryBuilder('companies')
        //     .where({ id: companyId })
        //     .update({ name });
        return Companies.query()
            .findById(companyId)
            .patch({ name });
    }

    // * For users in companies

    public static async addUser(
        companyId: number,
        userId: number
    ): Promise<Number> {
        // return queryBuilder
        //     .insert({
        //         id_company: companyId,
        //         id_user: userId
        //     })
        //     .into('users_companies');
        return Companies.relatedQuery('users')
            .for(companyId)
            .relate(userId);
    }

    public static async removeUser(
        companyId: number,
        userId: number
    ): Promise<Number> {
        // console.log(companyId, userId);
        // return queryBuilder('users_companies')
        //     .where({
        //         id_company: companyId,
        //         id_user: userId
        //     })
        //     .del();
        return Companies.relatedQuery('users')
            .for(companyId)
            .unrelate()
            .where({ id: userId });
    }

    // public static async getUserById(
    //     companyId: number,
    //     userId: number
    // ): Promise<any> {
    //     const query = queryBuilder
    //         .select()
    //         .from('user_companies')
    //         .where({ id_company: companyId, id_user: userId })
    //         .first();
    //     if (query) {
    //         return query;
    //     }
    //     return 0;
    // }

    // public static async getAllUsers(companyId: number): Promise<any> {
    //     const sql = queryBuilder
    //         .from('users_companies')
    //         .where({ id_company: companyId });
    //     // console.log(sql);
    //     return sql;
    // }
}
