class Ticket {
    id?: number;

    subject?: string;

    content?: string;

    creationDate?: Date;

    status?: string;

    idUser?: number;

    closedDate?: Date;

    idCompany?: number;

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
        this.isDeleted = bodyParams.isDeleted;
        this.lastUpdateUser = bodyParams.lastUpdateUser;
        this.lastUpdate = bodyParams.lastUpdate;

        // console.log(bodyParams.idCompany);
        // if (
        //     parseInt(bodyParams.id) > 0 &&
        //     bodyParams.id != '0' &&
        //     isNaN(bodyParams.id) === false
        // ) {
        //     this.id = Number(bodyParams.id);
        // } else {
        //     throw new Error('Field idCompany cannot be empty');
        // }
        if (
            parseInt(bodyParams.idCompany) > 0 &&
            bodyParams.idCompany != '0' &&
            isNaN(bodyParams.idCompany) === false
        ) {
            this.idCompany = Number(bodyParams.idCompany);
        } else {
            throw new Error('Field idCompany cannot be empty');
        }

        if (bodyParams.subject == '' || bodyParams.subject === undefined) {
            throw new Error('Field subject cannot be empty');
        }

        if (bodyParams.content == '' || bodyParams.subject === undefined) {
            throw new Error('Field content cannot be empty');
        }
    }
}

export default Ticket;
