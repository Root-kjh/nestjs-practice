import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { CreateUserCommand } from './create-user.command';
import * as uuid from 'uuid';
import { EmailService } from 'src/email/email.service';
import { UserCreatedEvent } from '../event/user-created.event';
import { ulid } from 'ulid';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private dataSource: DataSource,
    private eventBus: EventBus,
    private readonly emailService: EmailService,

    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async execute(command: CreateUserCommand): Promise<any> {
    const { name, email, password } = command;

    const isUserExist = await this.checkUserExists(email);
    if (isUserExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const signupVerifyToken = uuid.v1();

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.saveUser(name, email, password, signupVerifyToken);
      this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async checkUserExists(emailAddress: string) {
    const user = await this.usersRepository.findOne({
      where: { email: emailAddress },
    });
    return user !== null;
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user);
  }
}
