import nodemailer ,{ Transporter } from 'nodemailer';


export interface SendMailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachements?: Attachement[];
}

export interface Attachement {
    filename: string;
    path: string;
}


export class EmailService {

    private transporter: Transporter;



    constructor(
        mailerService:string,
        private readonly mailerEmail:string,
        senderEmailPassword:string
    ) {
        this.transporter = nodemailer.createTransport({
            service: mailerService,
            auth: {
                user: mailerEmail,
                pass: senderEmailPassword,
            }
        });
    }


    async sendEmail(options: SendMailOptions): Promise<boolean> {

        const { to, subject, htmlBody, attachements = [] } = options;


        try {

            const sentInformation = await this.transporter.sendMail({
                from: this.mailerEmail,
                to: to,
                subject: subject,
                html: htmlBody,
                attachments: attachements,
            });

            console.log( sentInformation );

            return true;
        } catch (error) {
            console.log("email error",error)
            return false;
        }

    }

}