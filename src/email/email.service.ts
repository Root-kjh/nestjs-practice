import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import emailConfig from 'src/config/emailConfig';
import * as nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer';

interface EmailOptions {
    to: string,
    subject: string,
    html: string
}

@Injectable()
export class EmailService {
    private transporter: Mail;

    constructor(
        @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
    ) {
        this.transporter = nodemailer.createTransport({
            service: config.service,
            auth: {
                user: config.auth.user,
                pass: config.auth.pass,
            }
        });
    }

    async sendMemberJoinVerification(emailAddress:string, signupVerifyToken: string) {
        const baseUrl = this.config.baseUrl;
        const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;
        const mailOptions: EmailOptions = {
            to: emailAddress,
            subject: '가입 인증 메일',
            html: `
                버튼 누르면 인증이 완료됨<br>
                <form action="${url}" method="POST">
                    <button>확인</button>
                </form>
            `
        }

        return await this.transporter.sendMail(mailOptions);
    }
}
