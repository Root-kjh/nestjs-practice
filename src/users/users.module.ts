import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { CreateUserHandler } from './command/create-user.handler';
import { DeleteUserHandler } from './command/delete-user.handler';
import { LoginHandler } from './command/login.handler';
import { VerifyEmailHandler } from './command/verify-email.handler';
import { UserEntity } from './entity/user.entity';
import { UserEventsHandler } from './event/user-events.handler';
import { GetUserInfoQueryHandler } from './query/get-user-info.handler';
import { UsersController } from './users.controller';

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
  ],
})
export class UsersModule {}
