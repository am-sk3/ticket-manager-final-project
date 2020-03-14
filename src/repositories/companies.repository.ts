import Users from '../schemas/users.schema';
import Companies from '../schemas/companies.schema';

export default class CompaniesRepository {
    public static async byId(companyId: number): Promise<Companies[]> {
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
            })
            .withGraphFetched('tickets(showOpen)')
            .modifiers({
                showOpen(builder) {
                    builder.select('id', 'subject', 'content').where({
                        id_company: companyId,
                        status: 'Open'
                    });
                }
            });
        return query;
    }

    public static async getAll(): Promise<Companies[]> {
        const query = Companies.query();
        return query;
    }

    public static async create(name: string): Promise<Companies> {
        return Companies.query().insert({ name });
    }

    public static async delete(companyId: number): Promise<Number> {
        return Companies.query()
            .findById(companyId)
            .patch({ isDeleted: true });
    }

    public static async update(
        companyId: number,
        name: string
    ): Promise<Number> {
        return Companies.query()
            .findById(companyId)
            .patch({ name });
    }

    // * For users in companies

    public static async addUser(
        companyId: number,
        userId: number
    ): Promise<Number> {
        return Companies.relatedQuery('users')
            .for(companyId)
            .relate(userId);
    }

    public static async removeUser(
        companyId: number,
        userId: number
    ): Promise<Number> {
        return Companies.relatedQuery('users')
            .for(companyId)
            .unrelate()
            .where({ id: userId });
    }

    public static async searchByUser(
        companyId: number,
        userId: number
    ): Promise<Boolean> {
        const company = await Companies.query().findById(companyId);

        const user = await company
            .$relatedQuery('users')
            .where({ id_user: userId })
            .first();

        if (user) {
            return true;
        }
        return false;
    }

    public static async byEmail(userEmail: string): Promise<Companies> {
        const user = await Users.query()
            .where({ email: userEmail })
            .first();
        const company = await user
            .$relatedQuery('companies')
            .select()
            .first();
        return company;
    }

    public static async byUserId(userId: number): Promise<Companies[]> {
        return Companies.query()
            .select()
            .where({ id_user: userId });
    }

    public static async byUserIdFirst(userId: number): Promise<Companies> {
        const user = await Users.query()
            .select('id')
            .findById(userId);

        const company = user.$relatedQuery('companies').first();
        return company;
    }
}
