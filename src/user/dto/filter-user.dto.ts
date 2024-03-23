import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UserFilterDTO {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
