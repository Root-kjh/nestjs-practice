import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email/email.service';
import { validationSchema } from './config/validationSchema';
import emailConfig from './config/emailConfig';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + `/**/*.entity{.ts,.js}`],
      synchronize: false,
      migrationsRun: false,
      migrations: [__dirname + `/**/migrations/*.js`],
      migrationsTableName: 'migrations'
    }),
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService, EmailService],
  
})
export class AppModule {}
