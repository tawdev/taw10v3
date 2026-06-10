import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceOfferingDto } from './dto/create-service-offering.dto';
import { UpdateServiceOfferingDto } from './dto/update-service-offering.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  findPublic() {
    return this.prisma.serviceOffering.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findAll() {
    return this.prisma.serviceOffering.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(dto: CreateServiceOfferingDto) {
    await this.ensureSortOrderAvailable(dto.sortOrder);
    return this.prisma.serviceOffering.create({ data: this.toCreateData(dto) });
  }

  async update(id: string, dto: UpdateServiceOfferingDto) {
    await this.ensureExists(id);
    if (dto.sortOrder) await this.ensureSortOrderAvailable(dto.sortOrder, id);
    return this.prisma.serviceOffering.update({ where: { id }, data: this.toUpdateData(dto) });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.serviceOffering.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: string) {
    const service = await this.prisma.serviceOffering.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  private async ensureSortOrderAvailable(sortOrder: number, ignoreId?: string) {
    const existing = await this.prisma.serviceOffering.findUnique({ where: { sortOrder } });
    if (existing && existing.id !== ignoreId) {
      throw new BadRequestException('Duplicate service sort orders are not allowed');
    }
  }

  private toCreateData(dto: CreateServiceOfferingDto) {
    return {
      slug: dto.slug.trim(),
      title_fr: dto.title_fr.trim(),
      title_en: dto.title_en.trim(),
      title_ar: dto.title_ar.trim(),
      description_fr: dto.description_fr.trim(),
      description_en: dto.description_en.trim(),
      description_ar: dto.description_ar.trim(),
      icon: dto.icon.trim(),
      imageUrl: dto.imageUrl.trim(),
      sortOrder: dto.sortOrder,
      isActive: dto.isActive,
    };
  }

  private toUpdateData(dto: UpdateServiceOfferingDto) {
    return {
      slug: dto.slug?.trim(),
      title_fr: dto.title_fr?.trim(),
      title_en: dto.title_en?.trim(),
      title_ar: dto.title_ar?.trim(),
      description_fr: dto.description_fr?.trim(),
      description_en: dto.description_en?.trim(),
      description_ar: dto.description_ar?.trim(),
      icon: dto.icon?.trim(),
      imageUrl: dto.imageUrl?.trim(),
      sortOrder: dto.sortOrder,
      isActive: dto.isActive,
    };
  }
}
