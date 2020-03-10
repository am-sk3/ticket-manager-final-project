// import { Model } from 'objection';
// import queryBuilder from '../core/db/index';
import User from '../models/User';
import Users from '../schemas/users.schema';

// Model.knex(queryBuilder);

export default class UsersRepository {
    public static async byId(userId: number): Promise<Users> {
        // return queryBuilder
        //     .select()
        //     .from('users')
        //     .where('id', '=', userId)
        //     .first();
        return Users.query()
            .select(
                'id',
                'name',
                'email',
                'created_at',
                'is_admin',
                'is_enabled'
            )
            .where({ id: userId })
            .first();
    }

    public static async getAll(): Promise<Users[]> {
        // const query = queryBuilder<User>('users');
        const query = Users.query().select(
            'id',
            'name',
            'email',
            'created_at',
            'is_admin',
            'is_enabled'
        );
        // console.log(query);
        return query;
    }

    public static async create(user: User): Promise<Users> {
        // const { name, email, password, id_company, is_admin } = req.
        // const values = JSON.stringify(user)
        return Users.query().insert(user);
        // return queryBuilder.insert(user).into('users');
    }

    public static async update(user: User, userId: number): Promise<Number> {
        // return queryBuilder('users').update();

        // console.log(user);
        return Users.query()
            .findById(userId)
            .patch(user);
    }

    public static async delete(userId: number): Promise<Number> {
        return Users.query()
            .findById(userId)
            .patch({
                isEnabled: false
            });
    }

    public static async changePassword(
        userId: number,
        newPassword: string
    ): Promise<any> {
        return Users.query()
            .findById(userId)
            .patch({
                password: newPassword
            });
    }

    public static async byEmail(userEmail: string): Promise<any> {
        // const query = Companies.query()
        // .where({ id: companyId })
        // .withGraphFetched('users(selectInfo)')
        // .modifiers({
        //     selectInfo(builder) {
        //         builder.select(
        //             'id',
        //             'name',
        //             'email',
        //             'created_at',
        //             'is_enabled'
        //         );
        //     }
        // })
        // .withGraphFetched('tickets(showOpen)')
        // .modifiers({
        //     showOpen(builder) {
        //         builder.select('id', 'subject', 'content').where({
        //             id_company: companyId,
        //             status: 'Open'
        //         });
        //     }
        // });

        return Users.query()
            .select('id')
            .where({ email: userEmail })
            .withGraphFetched('companies(users)')
            .modifiers({
                users(builder) {
                    builder.select('id_company').first();
                }
            })
            .first();
    }

    // public static async searchByCompany(
    //     companyId: number,
    //     userId: number
    // ): Promise<any> {
    //     const user = await Users.query().findById(userId);

    //     if (user) {
    //         const company = await user
    //             .$relatedQuery('companies')
    //             .where({ id_company: companyId })
    //             .first();
    //         console.log('returning from here');
    //         return company;
    //     }
    //     // const knex = Users.knex();

    //     // return knex.raw(
    //     //     `SELECT
    //     //         users_companies.id_company
    //     //      FROM
    //     //         users
    //     //      INNER JOIN users_companies ON users_companies.id_user = users.id
    //     //      WHERE
    //     //         users_companies.id_company = ${companyId}
    //     //         AND users.id = ${userId}`
    //     // );

    //     // return Users.relatedQuery('companies')
    //     //     .for(userId)
    //     //     .where('id_company', companyId);
    //     return null;
    // }
}
