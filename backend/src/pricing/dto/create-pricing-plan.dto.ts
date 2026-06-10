import { ApiProperty } from '@nestjs/swagger';
import { PricingTheme } from '@prisma/client';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { PricingFeatureDto } from './pricing-feature.dto';

export class CreatePricingPlanDto {
  @ApiProperty({ example: 'INTILAQA' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 2499 })
  @IsInt()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 'Pack essentiel pour creer votre societe.' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ enum: PricingTheme, example: PricingTheme.DEFAULT })
  @IsEnum(PricingTheme)
  theme!: PricingTheme;

  @ApiProperty({ example: false })
  @IsBoolean()
  isPopular!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive!: boolean;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  sortOrder!: number;

  @ApiProperty({ type: [PricingFeatureDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PricingFeatureDto)
  features!: PricingFeatureDto[];
}
