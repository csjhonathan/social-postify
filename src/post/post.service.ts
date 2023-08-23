import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const { title, text, image } = createPostDto;
    return await this.prisma.post.create({ data: { title, text, image } });
  }

  async findAll() {
    return await this.prisma.post.findMany();
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) throw new NotFoundException();

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const { title, text, image } = updatePostDto;

    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException();

    return await this.prisma.post.update({
      where: { id },
      data: { title, text, image: image ?? null },
    });
  }

  async remove(id: number) {
    const post = await this.prisma.post.findFirst({ where: { id } });

    if (!post) throw new NotFoundException();

    const publicationsCount = await this.prisma.publication.count({
      where: { postId: id },
    });
    if (publicationsCount > 0)
      throw new ForbiddenException('This post is linked to a publication!');

    return await this.prisma.post.delete({
      where: {
        id,
        AND: {
          NOT: {
            Publication: { some: {} },
          },
        },
      },
    });
  }
}
