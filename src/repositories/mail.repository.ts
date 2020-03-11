/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import mailparser, { EmailAddress } from 'mailparser';
import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import UsersRepository from './users.repository';
import TicketsRepository from './tickets.repository';
import CompaniesRepository from './companies.repository';

dotenv.config();

const ImapClient: any = require('emailjs-imap-client').default;

const testAccount = {
    user: process.env.MAIL_USER,
    email: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASS,
    host: process.env.MAIL_HOST,
    port: 587,
    tls: true,
    name: 'Ticket-Manager'
};

export default class MailRepository {
    public static async replyMail(
        ticketNumber: any,
        mailTo: EmailAddress,
        subject: string
    ): Promise<any> {
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass // generated ethereal password
            }
        });

        await transporter.sendMail({
            from: `"Ticket Manager" <${testAccount.email}`, // sender address
            to: mailTo, // list of receivers
            subject: `"${subject} - [ticket:${ticketNumber}]"`, // Subject line
            text: `Your email has been accepted by our system. Your ticket number is ${ticketNumber}`, // plain text body
            html: `<p>Your email has been accepted by our system. Your ticket number is ${ticketNumber}</p>` // html body
        });
    }

    public static async getAllEmails(): Promise<any> {
        const client = new ImapClient(testAccount.host, 993, {
            logLevel: 'none',
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            },
            useSecureTransport: true
        });

        const checkMail = async () => {
            console.log('Checking for emails...');

            try {
                await client.connect();

                const messages = await client.listMessages('INBOX', '1:1000', [
                    'uid',
                    'flags',
                    'envelope',
                    'bodystructure',
                    'body.peek[]'
                ]);

                // console.log(messages);
                //* Start verification for all messages

                for (const mail of messages) {
                    const message = await mailparser.simpleParser(
                        mail['body[]']
                    );

                    const emailId: string = mail.uid; // console.log(mail.uid);
                    const from = message.from.value[0];

                    // * deletes all messages that start with the same system email
                    if (from.address === testAccount.email) {
                        console.log('deleting system message');
                        try {
                            await client.deleteMessages('INBOX', emailId, {
                                byUid: true
                            });
                        } catch (error) {
                            console.log('error deleting messages');
                        }
                        continue;
                    }

                    // * this contains the user ID + companies that it belongs to
                    let userCheck;
                    try {
                        userCheck = await UsersRepository.byEmail(from.address);
                    } catch (error) {
                        console.log(
                            'error connecting to the DB. Error Details: ',
                            error.message
                        );
                    }

                    console.log(userCheck);

                    if (userCheck) {
                        // * company: emailCheck.companies[0].idCompany
                        // * id: emailCheck.id

                        console.log('start parsing');
                        //* test for comment parsing
                        let comment;
                        try {
                            comment = await MailRepository.parseComment(
                                message,
                                userCheck,
                                emailId
                            );
                        } catch (error) {
                            console.log('error while parsing comment');
                        }

                        console.log(comment);
                        if (comment) {
                            //* success, we need to break the loop
                            try {
                                await client.deleteMessages('INBOX', emailId, {
                                    byUid: true
                                });
                            } catch (error) {
                                //* ignore if error happens. will retry again in the next cycle (will probably create duplicate comment)
                            }
                            continue;
                        }
                        // }
                        console.log(userCheck);
                        let ticketParse;
                        try {
                            console.log('start parsing new ticket');
                            ticketParse = await MailRepository.parseNewTicket(
                                message,
                                userCheck
                            );
                        } catch (error) {
                            console.log('error creating new ticket');
                        }

                        console.log(ticketParse);

                        if (ticketParse) {
                            console.log(
                                'Ticket created! Number: ',
                                ticketParse
                            );
                            await MailRepository.replyMail(
                                ticketParse,
                                from,
                                message.subject
                            );

                            await client.deleteMessages('INBOX', emailId, {
                                byUid: true
                            });

                            console.log('delete message: ', emailId);
                        }
                    }
                }

                await client.close();
            } catch (error) {
                console.log('error: ', error);
            }
            console.log('email check finish.');
        };

        checkMail();
    }

    public static async parseComment(
        message: any,
        userData: any,
        emailId: any
    ): Promise<Boolean> {
        console.log('parsing comment');
        const searchString: RegExp = /(?:[ticket:[0-9]*])/gm;

        //* split the string by match
        const ticketString: string[] | null = message.subject.match(
            searchString
        );

        if (ticketString !== null && ticketString[0] !== undefined) {
            //* matches the ticket number from the string
            const ticketNumber: string[] | null = ticketString[0].match(/\d+/);

            if (ticketNumber !== null) {
                console.log(
                    'reply detected. Lets start the verification for the ticket'
                );
                // console.log(ticketNumber[0]);

                //* search for the ticket number in the DB
                const ticketVerify = await TicketsRepository.getOneTicket(
                    Number(ticketNumber[0])
                );

                if (ticketVerify) {
                    // * We have to insert as comment

                    // * Verify if the new user belongs to the company that opened the ticket
                    const companyVerify = await CompaniesRepository.searchByUser(
                        ticketVerify.id_company,
                        userData.id
                    );

                    console.log(companyVerify);

                    if (companyVerify) {
                        // } else {
                        console.log('user verified. processing reply');
                        const comment = await TicketsRepository.comment(
                            message.text,
                            emailId,
                            Number(ticketNumber[0])
                        );

                        console.log(
                            'New comment created for ticket ',
                            ticketNumber[0]
                        );

                        return true;
                    }
                } else {
                    console.log(
                        'ticket verification failed, skipping to creation...'
                    );
                }
            }
        }
        return false;
    }

    public static async parseNewTicket(
        message: any,
        userCheck: any
    ): Promise<any> {
        console.log('parsing new ticket');

        const ticket = await TicketsRepository.createTicket(
            message.subject,
            message.text,
            userCheck.id,
            userCheck.companies[0].idCompany
        );

        return ticket;
    }
}
