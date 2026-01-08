import nodemailer from 'nodemailer';

/**
 * Generate example email message for testing
 */
export class MailService {
    private static async testAccount() {
        try {
            const account = await nodemailer.createTestAccount();
            console.log('Credentials obtained, sending message...');

            // Initialize transporter after account is set
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: false, // Use true for port 465, false for port 587
                auth: {
                    user: account.user,
                    pass: account.pass,
                },
            });
            return transporter;
        } catch (err) {
            console.error('Failed to create a testing account. ' + (err as Error).message);
            throw new Error(err as string);
        }
    }

    /**
     * Send an email
     * @param mail - Email options
     * @param mail.from - Sender
     * @param mail.to - Receiver
     * @param mail.subject - Subject
     * @param mail.text - Content
     * @param mail.html - HTML content
     * @returns Preview URL
     * @throws {Error} If email sending fails
     */
    static async sendMail(mail: {
        from: string;
        to: string;
        subject: string;
        text: string;
        html: string;
    }) {
        const transporter = await this.testAccount();
        transporter.sendMail(mail, (err: any, info: any) => {
            if (err) {
                throw new Error(err);
            }
            return 'Preview URL: ' + nodemailer.getTestMessageUrl(info);
        });
    }
}
