class User {
    id?: number;

    name?: string;

    email?: string;

    password?: string;

    createdAt?: Date;

    isAdmin?: boolean = false;

    isEnabled?: boolean = true;

    constructor(bodyParams: any) {
        // { this.id, this.name, this.email, this.password, this.isAdmin, this.isEnabled } = bodyParams
        // this.id = bodyParams.id;
        this.name = bodyParams.name;
        this.email = bodyParams.email;
        this.password = bodyParams.password;
        // this.isAdmin = Boolean(bodyParams.isAdmin);
        if (bodyParams.isAdmin === 'true' || bodyParams.isAdmin === 1) {
            this.isAdmin = true;
        } else if (bodyParams.isAdmin === 'false' || bodyParams.isAdmin === 0) {
            this.isAdmin = false;
        }
        if (bodyParams.isEnabled === 'false' || bodyParams.isEnabled === 0) {
            this.isEnabled = false;
        } else if (
            bodyParams.isEnabled === 'true' ||
            bodyParams.isAdmin === 1
        ) {
            this.isEnabled = true;
        }
    }
}
export default User;
