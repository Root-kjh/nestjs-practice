import * as uuid from 'uuid';
import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';
import { AuthService } from 'src/auth/auth.service';
import { UserInfo } from './assets/UserInfo';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private dataSource: DataSource,
        private readonly emailService: EmailService,
        private readonly authService: AuthService,
        ) {}

    async login( email: string, password: string): Promise<string> {
        const user = await this.userRepository.findOne({
            where: { email, password }
        });
        if (!user) {
            throw new NotFoundException('유저가 존재하지 않습니다.');
        }

        return this.authService.login({
            id: user.id,
            name: user.name,
            email: user.email
        })
    }

    async createUser(name:string, email: string, password: string) {
        const isUserExist = await this.checkUserExists(email);
        if (isUserExist) {
            throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
        }
        
        const signupVerifyToken = uuid.v1()
        
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this.saveUser(name, email, password, signupVerifyToken);
            await this.sendMemberJoinEmail(email, signupVerifyToken);
            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    async getUserInfo(userId: string): Promise<UserInfo> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
        if (!user) {
            throw new NotFoundException('유저가 존재하지 않습니다.');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email
        }
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    private async checkUserExists(emailAddress: string){
        const user = await this.userRepository.findOne({
            where: { email: emailAddress }
        });
        return user !== null;
    }

    private async saveUser(name: string, email: string, password: string, signupVerifyToken: string){
        const user = new UserEntity();
        user.id = ulid();
        user.name = name;
        user.email = email;
        user.password = password;
        user.signupVerifyToken = signupVerifyToken;
        await this.userRepository.save(user);
    }

    private async sendMemberJoinEmail(email:string, signupVerifyToken: string) {
        await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
    }

    async verifyEmail(signupVerifyToken: string): Promise<string> {
        const user = await this.userRepository.findOne({
            where: { signupVerifyToken }
        });

        if (!user) {
            throw new NotFoundException('유저가 존재하지 않습니다.');
        }

        return this.authService.login({
            id: user.id,
            name: user.name,
            email: user.email,
        })
    }
}
