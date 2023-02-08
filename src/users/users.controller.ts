import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  LoggerService,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/auth.guard';
import { UserInfo } from './assets/UserInfo';
import { CreateUserCommand } from './command/create-user.command';
import { LoginCommand } from './command/login.command';
import { VerifyEmailCommand } from './command/verify-email.command';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { GetUserInfoQuery } from './query/get-user-info.query';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    this.logger.log(dto);
    const command = new CreateUserCommand(name, email, password);
    return this.commandBus.execute(command);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    this.logger.log(dto);

    const command = new VerifyEmailCommand(signupVerifyToken);
    return this.commandBus.execute(command);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    this.logger.log(dto);

    const command = new LoginCommand(email, password);
    return this.commandBus.execute(command);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    this.logger.log(userId);
    const query = new GetUserInfoQuery(userId);
    return this.queryBus.execute(query);
  }
}
