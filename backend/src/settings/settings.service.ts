import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.systemSetting.findFirst();
    if (!settings) {
      settings = await this.prisma.systemSetting.create({
        data: {}, // Prisma defaults will be applied
      });
    }
    return settings;
  }

  async updateSettings(data: any) {
    const settings = await this.getSettings();
    return this.prisma.systemSetting.update({
      where: { id: settings.id },
      data: {
        companyName: data.companyName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        address: data.address,
        facebook: data.facebook,
        instagram: data.instagram,
        linkedin: data.linkedin,
        logoUrl: data.logoUrl,
        faviconUrl: data.faviconUrl,
      },
    });
  }
}
