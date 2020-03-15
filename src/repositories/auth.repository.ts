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
            // 'email', '=', email)
            // .andWhere('password', '=', createHash('sha256').update(password).digest('hex'))
            // .andWhere('password', '=', password)
            .first();
        // console.log(user);
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
                // console.log(Math.floor(Date.now() / 1000) + (60 * 60));
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
        // password = createHash('sha256')            .update(password)            .digest('hex');

        return Users.query().insert({
            email,
            password,
            name
        });
    }
}
