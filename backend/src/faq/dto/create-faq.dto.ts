import { IsBoolean, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @MinLength(3)
  question!: string;

  @IsString()
  @MinLength(3)
  answer!: string;

  @IsInt()
  @Min(1)
  sortOrder!: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
