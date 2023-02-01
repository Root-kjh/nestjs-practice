import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Post()
    async createUser(@Body() dto: CreateUserDto): Promise<void> {
        const { name, email, password } = dto;
        await this.userService.createUser(name, email, password);
    }

    @Post("/email-verify")
    async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
        console.log(dto);
        return;
    }

    @Post("/login")
    async login(@Body() dto: UserLoginDto): Promise<string> {
        console.log(dto);
        return;
    }

    @Get("/:id")
    async getUserInfo(@Param("id") userId: string): Promise<string> {
        console.log(userId);
        return;
    }
}