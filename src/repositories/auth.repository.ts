// import { createHash } from 'crypto';
import { sign } from 'jsonwebtoken';
import Users from '../schemas/users.schema';

const secret: string = 'testingkey';

export default class AuthRepository {
    public static async attemptLogin(
        email: string,
        password: string
    ): Promise<string> {
        const user = await Users.query()
            .where({
                email,
                password,
                is_enabled: true
            })

            .first();
        return new Promise((resolve, reject) => {
            if (user) {
                const token = sign(
                    {
                        exp: Math.floor(Date.now() / 1000) + 60 * 10,
                        username: user.email,
                        user_id: user.id,
                        isAdmin: user.isAdmin
                    },
                    secret
                );
                resolve(token);
            }

            reject(new Error('Bad credentials!'));
        });
    }

    public static async register(
        name: string,
        email: string,
        password: string
    ): Promise<Users> {
        return Users.query().insert({
            email,
            password,
            name
        });
    }
}
