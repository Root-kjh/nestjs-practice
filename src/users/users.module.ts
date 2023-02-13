import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { CreateUserHandler } from './application/command/create-user.handler';
import { DeleteUserHandler } from './application/command/delete-user.handler';
import { LoginHandler } from './application/command/login.handler';
import { VerifyEmailHandler } from './application/command/verify-email.handler';
import { UserEntity } from './infra/db/entity/user.entity';
import { UserEventsHandler } from './application/event/user-events.handler';
import { GetUserInfoQueryHandler } from './application/query/get-user-info.handler';
import { UsersController } from './interface/users.controller';
import { UserRepository } from './infra/db/repository/UserRepository';
import { EmailService } from './infra/adapter/email.service';
import { UserFactory } from './domain/user.factory';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    CqrsModule,
  ],
  controllers: [UsersController],
  providers: [
    Logger,
    UserEventsHandler,
    CreateUserHandler,
    DeleteUserHandler,
    VerifyEmailHandler,
    LoginHandler,
    UserEventsHandler,
    GetUserInfoQueryHandler,
    UserFactory,
    { provide: 'UserRepository', useClass: UserRepository },
    { provide: 'EmailService', useClass: EmailService },
  ],
})
export class UsersModule {}
