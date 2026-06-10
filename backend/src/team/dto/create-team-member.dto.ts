import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateTeamMemberDto {
  @ApiProperty({ example: 'Hicham MHAMEDI' })
  @IsString()
  @IsNotEmpty()
  name_fr!: string;

  @ApiProperty({ example: 'Hicham MHAMEDI' })
  @IsString()
  @IsNotEmpty()
  name_en!: string;

  @ApiProperty({ example: 'محمدي هشام' })
  @IsString()
  @IsNotEmpty()
  name_ar!: string;

  @ApiProperty({ example: 'PDG & Fondateur' })
  @IsString()
  @IsNotEmpty()
  role_fr!: string;

  @ApiProperty({ example: 'CEO & Founder' })
  @IsString()
  @IsNotEmpty()
  role_en!: string;

  @ApiProperty({ example: 'الرئيس التنفيذي والمؤسس' })
  @IsString()
  @IsNotEmpty()
  role_ar!: string;

  @ApiProperty({ example: 'Leader visionnaire et expert en droit des affaires marocains.' })
  @IsString()
  @IsNotEmpty()
  description_fr!: string;

  @ApiProperty({ example: 'Visionary leader and Moroccan business law expert.' })
  @IsString()
  @IsNotEmpty()
  description_en!: string;

  @ApiProperty({ example: 'قائد رؤيوي وخبير في قانون الأعمال المغربي.' })
  @IsString()
  @IsNotEmpty()
  description_ar!: string;

  @ApiProperty({ example: '/hicham.jpeg' })
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
