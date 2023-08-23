import { Module } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationController } from './publication.controller';
import { MediaModule } from 'src/media/media.module';
import { PostModule } from 'src/post/post.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [MediaModule, PostModule],
  controllers: [PublicationController],
  providers: [PrismaService, PublicationService],
  exports: [PublicationService],
})
export class PublicationModule {}
