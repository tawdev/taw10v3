import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BlogStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogArticleDto } from './dto/create-blog-article.dto';
import { UpdateBlogArticleDto } from './dto/update-blog-article.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  findPublished() {
    return this.prisma.blogArticle.findMany({
      where: { status: BlogStatus.PUBLISHED },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'asc' }],
    });
  }

  findAll() {
    return this.prisma.blogArticle.findMany({
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.blogArticle.findUnique({
      where: { slug },
    });
    if (!article || article.status !== BlogStatus.PUBLISHED) {
      throw new NotFoundException('Blog article not found');
    }
    return article;
  }

  async create(dto: CreateBlogArticleDto) {
    return this.prisma.blogArticle.create({
      data: this.toCreateData(dto),
    });
  }

  async update(id: string, dto: UpdateBlogArticleDto) {
    await this.ensureExists(id);

    return this.prisma.blogArticle.update({
      where: { id },
      data: this.toUpdateData(dto),
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.blogArticle.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: string) {
    const article = await this.prisma.blogArticle.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Blog article not found');
    return article;
  }

  private calculateReadingTime(content: string): number {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  private toCreateData(dto: CreateBlogArticleDto): Prisma.BlogArticleCreateInput {
    const readingTime = dto.readingTime !== undefined ? dto.readingTime : this.calculateReadingTime(dto.content_fr || '');
    return {
      title: dto.title_fr.trim(),
      title_fr: dto.title_fr.trim(),
      title_en: dto.title_en.trim(),
      title_ar: dto.title_ar.trim(),
      slug: dto.slug.trim(),
      featuredImage: dto.featuredImage.trim(),
      excerpt: dto.excerpt_fr.trim(),
      excerpt_fr: dto.excerpt_fr.trim(),
      excerpt_en: dto.excerpt_en.trim(),
      excerpt_ar: dto.excerpt_ar.trim(),
      content: dto.content_fr.trim(),
      content_fr: dto.content_fr.trim(),
      content_en: dto.content_en.trim(),
      content_ar: dto.content_ar.trim(),
      metaTitle: dto.metaTitle_fr.trim(),
      metaTitle_fr: dto.metaTitle_fr.trim(),
      metaTitle_en: dto.metaTitle_en.trim(),
      metaTitle_ar: dto.metaTitle_ar.trim(),
      metaDescription: dto.metaDescription_fr.trim(),
      metaDescription_fr: dto.metaDescription_fr.trim(),
      metaDescription_en: dto.metaDescription_en.trim(),
      metaDescription_ar: dto.metaDescription_ar.trim(),
      keywords: dto.keywords?.trim() || null,
      language: dto.language?.trim() || 'fr',
      author: dto.author?.trim() || 'TAW 10',
      category: dto.category?.trim() || 'Business',
      readingTime: readingTime,
      status: dto.status,
      publishedAt: this.parsePublishedAt(dto.publishedAt),
    };
  }

  private toUpdateData(dto: UpdateBlogArticleDto): Prisma.BlogArticleUpdateInput {
    let readingTime = dto.readingTime;
    if (readingTime === undefined && dto.content_fr !== undefined) {
      readingTime = this.calculateReadingTime(dto.content_fr);
    }
    return {
      title: dto.title_fr?.trim(),
      title_fr: dto.title_fr?.trim(),
      title_en: dto.title_en?.trim(),
      title_ar: dto.title_ar?.trim(),
      slug: dto.slug?.trim(),
      featuredImage: dto.featuredImage?.trim(),
      excerpt: dto.excerpt_fr?.trim(),
      excerpt_fr: dto.excerpt_fr?.trim(),
      excerpt_en: dto.excerpt_en?.trim(),
      excerpt_ar: dto.excerpt_ar?.trim(),
      content: dto.content_fr?.trim(),
      content_fr: dto.content_fr?.trim(),
      content_en: dto.content_en?.trim(),
      content_ar: dto.content_ar?.trim(),
      metaTitle: dto.metaTitle_fr?.trim(),
      metaTitle_fr: dto.metaTitle_fr?.trim(),
      metaTitle_en: dto.metaTitle_en?.trim(),
      metaTitle_ar: dto.metaTitle_ar?.trim(),
      metaDescription: dto.metaDescription_fr?.trim(),
      metaDescription_fr: dto.metaDescription_fr?.trim(),
      metaDescription_en: dto.metaDescription_en?.trim(),
      metaDescription_ar: dto.metaDescription_ar?.trim(),
      keywords: dto.keywords === null ? null : dto.keywords?.trim(),
      language: dto.language?.trim(),
      author: dto.author?.trim(),
      category: dto.category?.trim(),
      readingTime: readingTime,
      status: dto.status,
      publishedAt: dto.publishedAt === null ? null : this.parsePublishedAt(dto.publishedAt),
    };
  }

  private parsePublishedAt(value?: string | null) {
    const publishedAt = value ? new Date(value) : undefined;
    if (publishedAt && Number.isNaN(publishedAt.getTime())) {
      throw new BadRequestException('Invalid publishedAt date');
    }

    return publishedAt;
  }
}
