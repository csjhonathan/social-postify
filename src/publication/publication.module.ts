import { Module, forwardRef } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationController } from './publication.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PostModule } from '../post/post.module';
import { MediaModule } from '../media/media.module';
import { PublicationRepository } from './publication.repository';
import { PostRepository } from '../post/post.repository';
import { MediaRepository } from '../media/media.repository';
import { BuildMessageHelper } from '../helpers/build.message';

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
    BuildMessageHelper,
  ],
  exports: [PublicationService],
})
export class PublicationModule {}
