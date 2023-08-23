import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [PrismaClient],
  controllers: [MediaController],
  providers: [PrismaService, MediaService],
  exports: [MediaService],
})
export class MediaModule {}
