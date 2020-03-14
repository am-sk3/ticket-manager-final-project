import User from '../models/User';
import Users from '../schemas/users.schema';

export default class UsersRepository {
    public static async byId(userId: number): Promise<Users> {
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
        const query = Users.query().select(
            'id',
            'name',
            'email',
            'created_at',
            'is_admin',
            'is_enabled'
        );
        return query;
    }

    public static async create(user: User): Promise<Users> {
        return Users.query().insert(user);
    }

    public static async update(user: User, userId: number): Promise<Number> {
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

    public static async byEmail(userEmail: string): Promise<Users> {
        return (
            Users.query()
                .select('users.id', 'users_companies.id_company')
                .where({ email: userEmail, is_enabled: true })
                .innerJoin(
                    'users_companies',
                    'users.id',
                    '=',
                    'users_companies.id_user'
                )
                // .withGraphFetched('companies(users)')
                // .modifiers({
                //     users(builder) {
                //         builder.select('id_company');
                //     }
                // })
                .first()
        );
    }
}
