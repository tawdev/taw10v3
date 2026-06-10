import { IsBoolean, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @MinLength(3)
  question_fr!: string;

  @IsString()
  @MinLength(3)
  question_en!: string;

  @IsString()
  @MinLength(3)
  question_ar!: string;

  @IsString()
  @MinLength(3)
  answer_fr!: string;

  @IsString()
  @MinLength(3)
  answer_en!: string;

  @IsString()
  @MinLength(3)
  answer_ar!: string;

  @IsInt()
  @Min(1)
  sortOrder!: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
