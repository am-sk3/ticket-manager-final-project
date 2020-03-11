import moment = require('moment');

class Ticket {
    id?: number;

    subject?: string;

    content?: string;

    creationDate?: Date;

    status?: string;

    idUser?: number;

    closedDate?: Date;

    idCompany?: number = undefined;

    isDeleted?: boolean;

    lastUpdateUser?: number;

    lastUpdate?: Date;

    constructor(bodyParams: any) {
        this.subject = bodyParams.subject;
        this.content = bodyParams.content;
        this.status = bodyParams.status;
        this.creationDate = bodyParams.creationDate;
        this.idUser = bodyParams.idUser;
        this.closedDate = bodyParams.closedDate;
        this.idCompany = Number(bodyParams.idCompany);
        this.isDeleted = bodyParams.isDeleted;
        this.lastUpdateUser = bodyParams.lastUpdateUser;
        this.lastUpdate = bodyParams.lastUpdate;

        // moment().format('YYYY-MM-DD h:mm:ss');
        if (Number.isInteger(bodyParams.idCompany) === true) {
            this.idCompany = Number(bodyParams.idCompany);
        }
    }
}

export default Ticket;
