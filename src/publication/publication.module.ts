import { Module } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationController } from './publication.controller';
import { MediaModule } from 'src/media/media.module';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [MediaModule, PostModule],
  controllers: [PublicationController],
  providers: [PublicationService],
  exports: [PublicationService],
})
export class PublicationModule {}
