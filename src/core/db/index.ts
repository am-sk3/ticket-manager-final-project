import * as dotenv from 'dotenv';
import knex from 'knex';
// import { Model } from 'objection';

dotenv.config();

const queryBuilder = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        typeCast: function castField(field: any, useDefaultTypeCasting: any) {
            // We only want to cast bit fields that have a single-bit in them. If the field
            // has more than one bit, then we cannot assume it is supposed to be a Boolean.
            if (field.type === 'BIT' && field.length === 1) {
                const bytes = field.buffer();

                // A Buffer in Node represents a collection of 8-bit unsigned integers.
                // Therefore, our single "bit field" comes back as the bits '0000 0001',
                // which is equivalent to the number 1.
                return bytes[0] === 1;
            }

            return useDefaultTypeCasting();
        }
    }
    // debug: true
});

// Model.knex(queryBuilder);
export default queryBuilder;
