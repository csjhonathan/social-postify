import { Module, forwardRef } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PublicationModule } from '../publication/publication.module';
import { PostRepository } from './post.repository';
import { PublicationRepository } from '../publication/publication.repository';

@Module({
  imports: [PrismaModule, forwardRef(() => PublicationModule)],
  controllers: [PostController],
  providers: [PostRepository, PostService, PublicationRepository],
  exports: [PostService],
})
export class PostModule {}
