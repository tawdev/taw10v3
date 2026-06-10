import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { FaqReactionDto } from './dto/faq-reaction.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  findPublic() {
    return this.prisma.faqItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findAll() {
    return this.prisma.faqItem.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(dto: CreateFaqDto) {
    await this.ensureSortOrderAvailable(dto.sortOrder);
    return this.prisma.faqItem.create({
      data: {
        question: dto.question.trim(),
        answer: dto.answer.trim(),
        sortOrder: dto.sortOrder,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateFaqDto) {
    await this.ensureExists(id);
    if (dto.sortOrder) await this.ensureSortOrderAvailable(dto.sortOrder, id);

    return this.prisma.faqItem.update({
      where: { id },
      data: {
        question: dto.question?.trim(),
        answer: dto.answer?.trim(),
        sortOrder: dto.sortOrder,
        isActive: dto.isActive,
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.faqItem.delete({ where: { id } });
    return { success: true };
  }

  async react(id: string, dto: FaqReactionDto) {
    await this.ensureExists(id);
    return this.prisma.faqItem.update({
      where: { id },
      data: dto.type === 'like'
        ? { likeCount: { increment: 1 } }
        : { dislikeCount: { increment: 1 } },
    });
  }

  private async ensureExists(id: string) {
    const faq = await this.prisma.faqItem.findUnique({ where: { id } });
    if (!faq) throw new NotFoundException('FAQ item not found');
    return faq;
  }

  private async ensureSortOrderAvailable(sortOrder: number, ignoreId?: string) {
    try {
      const existing = await this.prisma.faqItem.findUnique({ where: { sortOrder } });
      if (existing && existing.id !== ignoreId) {
        throw new BadRequestException('Duplicate FAQ sort orders are not allowed');
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;
      throw error;
    }
  }
}
