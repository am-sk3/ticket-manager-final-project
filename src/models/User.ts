class User {
    id?: number;

    name?: string;

    email?: string;

    password?: string;

    createdAt?: Date;

    isAdmin?: boolean;

    isEnabled?: boolean;

    constructor(bodyParams: any) {
        // { this.id, this.name, this.email, this.password, this.isAdmin, this.isEnabled } = bodyParams
        // this.id = bodyParams.id;
        this.name = bodyParams.name;
        this.email = bodyParams.email;
        this.password = bodyParams.password;
        this.isAdmin = bodyParams.isAdmin;
        this.isEnabled = bodyParams.isEnabled;
    }
}
export default User;
