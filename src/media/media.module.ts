import { Module, forwardRef } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PublicationModule } from '../publication/publication.module';
import { MediaRepository } from './media.repository';
import { PublicationRepository } from '../publication/publication.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaModule, forwardRef(() => PublicationModule)],
  controllers: [MediaController],
  providers: [
    MediaService,
    MediaRepository,
    PublicationRepository,
    PrismaService,
  ],
  exports: [MediaService],
})
export class MediaModule {}
