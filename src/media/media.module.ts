import { Module, forwardRef } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PublicationModule } from 'src/publication/publication.module';
import { MediaRepository } from './media.repository';
import { PublicationRepository } from 'src/publication/publication.repository';

@Module({
  imports: [PrismaModule, forwardRef(() => PublicationModule)],
  controllers: [MediaController],
  providers: [MediaService, MediaRepository, PublicationRepository],
  exports: [MediaService],
})
export class MediaModule {}
