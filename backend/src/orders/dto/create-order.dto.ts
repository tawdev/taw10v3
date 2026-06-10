import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @MinLength(2)
  customerName!: string;

  @IsString()
  @MinLength(6)
  phone!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  selectedPlan!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
