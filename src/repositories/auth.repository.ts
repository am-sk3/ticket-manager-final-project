// import { createHash } from 'crypto';
import { sign } from 'jsonwebtoken';
// import dotenv from 'dotenv';
import queryBuilder from '../core/db';
// import Token from '../models/Token';

// dotenv.config();

const secret: string = 'testingkey';

export default class AuthRepository {
    public static async attemptLogin(
        email: string,
        password: string
    ): Promise<string> {
        const user: any = await queryBuilder
            .select()
            .from('users')
            .where({
                email,
                password
            })
            // 'email', '=', email)
            // .andWhere('password', '=', createHash('sha256').update(password).digest('hex'))
            // .andWhere('password', '=', password)
            .first();
        console.log(user);
        return new Promise((resolve, reject) => {
            if (user) {
                const token = sign(
                    {
                        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 31,
                        username: user.email,
                        user_id: user.id
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
    ): Promise<number[]> {
        // password = createHash('sha256')            .update(password)            .digest('hex');

        return queryBuilder
            .insert({
                email,
                password,
                name
            })
            .into('users');
    }

    // public static async getUserInfo(user: number): Promise<any> {
    //     const sql = `
    //         SELECT
    //             blah_count,
    //             IF (
    //                 text IS NULL,
    //                 'You have no blahs!',
    //                 text
    //             ) AS text,
    //             followers,
    //             following
    //         FROM
    //             (
    //                 SELECT
    //                     COUNT(*) AS blah_count
    //                 FROM posts
    //                 WHERE id_user = :user_id
    //             ) AS BC
    //         LEFT JOIN
    //             (
    //                 SELECT
    //                     id_user,
    //                     text
    //                 FROM posts
    //                 WHERE id_user = :user_id
    //                 ORDER BY created_at DESC
    //                 LIMIT 1
    //             ) AS B ON B.id_user = :user_id
    //         JOIN
    //             (
    //                 SELECT
    //                     COUNT(*) AS followers
    //                 FROM follows
    //                 WHERE
    //                     id_followee = :user_id
    //             ) AS FE
    //         JOIN
    //             (
    //                 SELECT
    //                     COUNT(*) AS following
    //                 FROM follows
    //                 WHERE id_user = :user_id
    //             ) AS FR
    //     `;

    // return queryBuilder.raw(sql, { user_id: user });
    // }d
}
