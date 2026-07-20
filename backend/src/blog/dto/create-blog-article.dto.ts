import { ApiProperty } from '@nestjs/swagger';
import { BlogStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogArticleDto {
  @ApiProperty({ example: 'Comment creer une societe a Marrakech en 2026' })
  @IsString()
  @IsNotEmpty()
  title_fr!: string;

  @ApiProperty({ example: 'How to set up a company in Marrakech in 2026' })
  @IsString()
  @IsNotEmpty()
  title_en!: string;

  @ApiProperty({ example: 'كيفية إنشاء شركة في مراكش عام 2026' })
  @IsString()
  @IsNotEmpty()
  title_ar!: string;

  @ApiProperty({ example: 'comment-creer-societe-maroc-2026' })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop' })
  @IsString()
  @IsNotEmpty()
  featuredImage!: string;

  @ApiProperty({ example: 'Decouvrez toutes les etapes pour creer votre societe a Marrakech.' })
  @IsString()
  @IsNotEmpty()
  excerpt_fr!: string;

  @ApiProperty({ example: 'Learn every step to create your company in Marrakech.' })
  @IsString()
  @IsNotEmpty()
  excerpt_en!: string;

  @ApiProperty({ example: 'اكتشف جميع خطوات إنشاء شركتك في مراكش.' })
  @IsString()
  @IsNotEmpty()
  excerpt_ar!: string;

  @ApiProperty({ example: 'Article content...' })
  @IsString()
  @IsNotEmpty()
  content_fr!: string;

  @ApiProperty({ example: 'Article content...' })
  @IsString()
  @IsNotEmpty()
  content_en!: string;

  @ApiProperty({ example: 'محتوى المقال...' })
  @IsString()
  @IsNotEmpty()
  content_ar!: string;

  @ApiProperty({ example: 'Creation societe Marrakech 2026' })
  @IsString()
  @IsNotEmpty()
  metaTitle_fr!: string;

  @ApiProperty({ example: 'Company formation Marrakech 2026' })
  @IsString()
  @IsNotEmpty()
  metaTitle_en!: string;

  @ApiProperty({ example: 'إنشاء شركة في مراكش 2026' })
  @IsString()
  @IsNotEmpty()
  metaTitle_ar!: string;

  @ApiProperty({ example: 'Guide complet pour creer une societe a Marrakech en 2026.' })
  @IsString()
  @IsNotEmpty()
  metaDescription_fr!: string;

  @ApiProperty({ example: 'Complete guide to creating a company in Marrakech in 2026.' })
  @IsString()
  @IsNotEmpty()
  metaDescription_en!: string;

  @ApiProperty({ example: 'دليل كامل لإنشاء شركة في مراكش عام 2026.' })
  @IsString()
  @IsNotEmpty()
  metaDescription_ar!: string;

  @ApiProperty({ enum: BlogStatus, example: BlogStatus.PUBLISHED })
  @IsEnum(BlogStatus)
  status!: BlogStatus;

  @ApiProperty({ required: false, example: '2026-05-19' })
  @IsOptional()
  @IsString()
  publishedAt?: string | null;

  @ApiProperty({ required: false, example: 'domiciliation, creation, Marrakech' })
  @IsOptional()
  @IsString()
  keywords?: string | null;

  @ApiProperty({ required: false, example: 'fr' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ required: false, example: 'TAW 10' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({ required: false, example: 'Business' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false, example: 5 })
  @IsOptional()
  readingTime?: number;
}
