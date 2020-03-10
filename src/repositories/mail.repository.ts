/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// import imapClient from 'emailjs-imap-client';
import mailparser, { EmailAddress } from 'mailparser';
import nodemailer from 'nodemailer';
import UsersRepository from './users.repository';
import TicketsRepository from './tickets.repository';
import CompaniesRepository from './companies.repository';

const ImapClient: any = require('emailjs-imap-client').default;

const testAccount = {
    user: 'olaf.monahan95@ethereal.email',
    email: 'olaf.monahan95@ethereal.email',
    pass: 'vzUcnzgma22jmAa58X',
    host: 'smtp.ethereal.email',
    port: 587,
    tls: true,
    name: 'Olaf'
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

        const mailBody = await transporter.sendMail({
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
                for (var object of messages) {
                    const message = await mailparser.simpleParser(
                        object['body[]']
                    );

                    const emailId: string = object.uid; // console.log(object.uid);
                    const from = message.from.value[0];

                    const emailCheck = await UsersRepository.byEmail(
                        from.address
                    );

                    if (from.address == testAccount.email) {
                        console.log('deleting system message');
                        await client.deleteMessages('INBOX', emailId, {
                            byUid: true
                        });
                    }
                    // console.log(emailCheck, from);

                    if (emailCheck && emailCheck.companies.length > 0) {
                        // * company: emailCheck.companies[0].idCompany
                        // * id: emailCheck.id
                        // let ticket: any;
                        console.log('start parsing');
                        const regex = /(?:\[ticket:[0-9]*\])/gm;
                        if (message.subject.match(regex)) {
                            console.log(
                                'reply detected. Lets start the verification for the ticket'
                            );

                            let ticketString: string[] | null;

                            ticketString = message.subject.match(regex);

                            if (
                                ticketString !== null &&
                                ticketString[0] !== undefined
                            ) {
                                let ticketNumber: string[] | null;

                                ticketNumber = ticketString[0].match(/\d+/);

                                if (ticketNumber !== null) {
                                    // console.log(ticketNumber[0]);

                                    const ticketVerify = await TicketsRepository.getOneTicket(
                                        Number(ticketNumber[0])
                                    );

                                    if (ticketVerify) {
                                        // * We have to insert as comment

                                        // * Verify if the new user belongs to the company that opened the ticket
                                        const companyVerify = await CompaniesRepository.searchByUser(
                                            ticketVerify.id_company,
                                            emailCheck.id
                                        );

                                        console.log(companyVerify);

                                        if (companyVerify) {
                                            // } else {
                                            console.log(
                                                'user verified. processing reply'
                                            );
                                            const comment = await TicketsRepository.comment(
                                                message.text,
                                                emailCheck.id,
                                                Number(ticketNumber[0])
                                            );

                                            console.log(
                                                'New comment created for ticket ',
                                                ticketNumber[0]
                                            );
                                            await client.deleteMessages(
                                                'INBOX',
                                                emailId,
                                                {
                                                    byUid: true
                                                }
                                            );
                                            continue;
                                        }
                                    } else {
                                        console.log(
                                            'ticket verification failed, skipping to creation...'
                                        );
                                    }
                                }
                            }
                        }

                        const ticket = await TicketsRepository.createTicket(
                            message.subject,
                            message.text,
                            emailCheck.id,
                            emailCheck.companies[0].idCompany
                        );
                        if (ticket) {
                            console.log('Ticket created! Number: ', ticket);
                        }
                        await MailRepository.replyMail(
                            ticket,
                            from,
                            message.subject
                        );

                        await client.deleteMessages('INBOX', emailId, {
                            byUid: true
                        });
                    }
                    // console.log('delete message: ', emailId);
                }
                // console.log(messages.flags);
                await client.close();
            } catch (error) {
                console.log('error: ', error);
            }
            console.log('email check finish.');
        };

        checkMail();
    }
}
