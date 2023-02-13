import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class VerifyEmailDto {
  @Transform((params) => params.value.trim())
  @IsString()
  readonly signupVerifyToken: string;
}
