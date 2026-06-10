import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateServiceOfferingDto {
  @ApiProperty({ example: 'domiciliation' })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty({ example: 'Domiciliation Premium' })
  @IsString()
  @IsNotEmpty()
  title_fr!: string;

  @ApiProperty({ example: 'Premium Domiciliation' })
  @IsString()
  @IsNotEmpty()
  title_en!: string;

  @ApiProperty({ example: 'التوطين الممتاز' })
  @IsString()
  @IsNotEmpty()
  title_ar!: string;

  @ApiProperty({ example: 'Une adresse prestigieuse pour votre siege social.' })
  @IsString()
  @IsNotEmpty()
  description_fr!: string;

  @ApiProperty({ example: 'A prestigious address for your registered office.' })
  @IsString()
  @IsNotEmpty()
  description_en!: string;

  @ApiProperty({ example: 'عنوان مرموق لمقر شركتك.' })
  @IsString()
  @IsNotEmpty()
  description_ar!: string;

  @ApiProperty({ example: 'location_on' })
  @IsString()
  @IsNotEmpty()
  icon!: string;

  @ApiProperty({ example: '/luxury_marrakech_office_hero_1775496536100.png' })
  @IsString()
  @IsNotEmpty()
  imageUrl!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  sortOrder!: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive!: boolean;
}
