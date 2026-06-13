import { BadRequestException, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { diskStorage } from 'multer';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UsersService } from '../users/users.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get('dashboard')
  dashboard() {
    return {
      platform: 'TAW10',
      status: 'ready',
    };
  }

  @Get('users')
  users() {
    return this.usersService.listAdmins();
  }

  @Get('settings')
  settings() {
    return {
      roles: [Role.SUPER_ADMIN, Role.ADMIN],
      registration: 'disabled',
    };
  }

  @Get('documents')
  documents() {
    return [];
  }

  @Post('upload/image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (_request: any, _file: any, callback: (error: Error | null, destination: string) => void) => {
        const uploadDir = join(process.cwd(), 'uploads', 'images');
        if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
        callback(null, uploadDir);
      },
      filename: (_request: any, file: any, callback: (error: Error | null, filename: string) => void) => {
        const extension = extname(file.originalname).toLowerCase();
        callback(null, `${randomUUID()}${extension}`);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_request, file, callback) => {
      if (!file.mimetype.startsWith('image/')) {
        callback(new BadRequestException('Only image files are allowed'), false);
        return;
      }
      callback(null, true);
    },
  }))
  uploadImage(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('Image file is required');
    return { imageUrl: `/uploads/images/${file.filename}` };
  }
}
