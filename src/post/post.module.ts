import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [PrismaClient],
  controllers: [PostController],
  providers: [PrismaService, PostService],
  exports: [PostService],
})
export class PostModule {}
