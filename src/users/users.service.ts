import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {

    constructor(private readonly emailService: EmailService) {}

    async createUser(name:string, email: string, password: string) {
        await this.checkUserExists(email);

        const signupVerifyToken = uuid.v1()

        await this.saveUser(name, email, password, signupVerifyToken);
        await this.sendMemberJoinEmail(email, signupVerifyToken);
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    private checkUserExists(email: string){
        return false; // TODO: DB 연동 후 구현
    }

    private saveUser(name: string, email: string, password: string, signupVerifyToken: string){
        return; // TODO: DB 연동 후 구현
    }

    private async sendMemberJoinEmail(email:string, signupVerifyToken: string) {
        await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
    }
}
