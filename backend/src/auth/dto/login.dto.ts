import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@taw10.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Admin@2026!' })
  @IsString()
  @MinLength(8)
  password!: string;
}
