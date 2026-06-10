import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class PricingFeatureDto {
  @ApiProperty({ example: 'Certificat Négatif' })
  @IsString()
  @IsNotEmpty()
  name_fr!: string;

  @ApiProperty({ example: 'الشهادة السلبية' })
  @IsString()
  @IsNotEmpty()
  name_ar!: string;

  @ApiProperty({ example: 'Negative Certificate' })
  @IsString()
  @IsNotEmpty()
  name_en!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isIncluded!: boolean;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  sortOrder!: number;
}
