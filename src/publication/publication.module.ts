import { Module, forwardRef } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationController } from './publication.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostModule } from 'src/post/post.module';
import { MediaModule } from 'src/media/media.module';
import { PublicationRepository } from './publication.repository';
import { PostRepository } from 'src/post/post.repository';
import { MediaRepository } from 'src/media/media.repository';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => PostModule),
    forwardRef(() => MediaModule),
  ],
  controllers: [PublicationController],
  providers: [
    PublicationRepository,
    PublicationService,
    PostRepository,
    MediaRepository,
  ],
  exports: [PublicationService],
})
export class PublicationModule {}
