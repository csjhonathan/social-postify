import { Module, forwardRef } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PublicationModule } from 'src/publication/publication.module';
import { PostRepository } from './post.repository';
import { PublicationRepository } from 'src/publication/publication.repository';

@Module({
  imports: [PrismaModule, forwardRef(() => PublicationModule)],
  controllers: [PostController],
  providers: [PostRepository, PostService, PublicationRepository],
  exports: [PostService],
})
export class PostModule {}
