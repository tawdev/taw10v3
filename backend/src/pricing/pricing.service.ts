import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePricingPlanDto } from './dto/create-pricing-plan.dto';
import { UpdatePricingPlanDto } from './dto/update-pricing-plan.dto';

const includeFeatures = {
  features: {
    orderBy: { sortOrder: 'asc' as const },
    select: {
      id: true,
      name_fr: true,
      name_ar: true,
      name_en: true,
      isIncluded: true,
      sortOrder: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(includeInactive = false) {
    return this.prisma.pricingPlan.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: includeFeatures,
    });
  }

  async findOne(id: string) {
    const plan = await this.prisma.pricingPlan.findUnique({
      where: { id },
      include: includeFeatures,
    });

    if (!plan) throw new NotFoundException('Pricing plan not found');
    return plan;
  }

  async create(dto: CreatePricingPlanDto) {
    this.validateFeatureSortOrders(dto.features);
    await this.ensurePlanSortOrderAvailable(dto.sortOrder);

    return this.prisma.pricingPlan.create({
      data: {
        name: dto.name,
        price: dto.price,
        description: dto.description,
        theme: dto.theme,
        isPopular: dto.isPopular,
        isActive: dto.isActive,
        sortOrder: dto.sortOrder,
        features: {
          create: dto.features.map((feature) => ({
            name_fr: feature.name_fr.trim(),
            name_ar: feature.name_ar.trim(),
            name_en: feature.name_en.trim(),
            isIncluded: feature.isIncluded,
            sortOrder: feature.sortOrder,
          })),
        },
      },
      include: includeFeatures,
    });
  }

  async update(id: string, dto: UpdatePricingPlanDto) {
    await this.findOne(id);
    if (dto.features) this.validateFeatureSortOrders(dto.features);
    if (dto.sortOrder) await this.ensurePlanSortOrderAvailable(dto.sortOrder, id);

    return this.prisma.$transaction(async (tx) => {
      if (dto.features) {
        await tx.pricingFeature.deleteMany({ where: { planId: id } });
      }

      return tx.pricingPlan.update({
        where: { id },
        data: {
          name: dto.name,
          price: dto.price,
          description: dto.description,
          theme: dto.theme,
          isPopular: dto.isPopular,
          isActive: dto.isActive,
          sortOrder: dto.sortOrder,
          ...(dto.features
            ? {
                features: {
                  create: dto.features.map((feature) => ({
                    name_fr: feature.name_fr.trim(),
                    name_ar: feature.name_ar.trim(),
                    name_en: feature.name_en.trim(),
                    isIncluded: feature.isIncluded,
                    sortOrder: feature.sortOrder,
                  })),
                },
              }
            : {}),
        },
        include: includeFeatures,
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.pricingPlan.delete({ where: { id } });
    return { success: true };
  }

  private validateFeatureSortOrders(features: Array<{ name_fr: string; name_ar: string; name_en: string; sortOrder: number }>) {
    const seen = new Set<number>();

    for (const feature of features) {
      if (!feature.name_fr.trim() || !feature.name_ar.trim() || !feature.name_en.trim()) {
        throw new BadRequestException('Feature names cannot be empty for any language');
      }
      if (seen.has(feature.sortOrder)) throw new BadRequestException('Duplicate feature sort orders are not allowed');
      seen.add(feature.sortOrder);
    }
  }

  private async ensurePlanSortOrderAvailable(sortOrder: number, ignoreId?: string) {
    const existing = await this.prisma.pricingPlan.findUnique({ where: { sortOrder } });

    if (existing && existing.id !== ignoreId) {
      throw new BadRequestException('Duplicate pricing plan sort orders are not allowed');
    }
  }
}
