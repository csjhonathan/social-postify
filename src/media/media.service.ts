import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async create(createMediaDto: CreateMediaDto) {
    const { title, username } = createMediaDto;
    const existsMedia = await this.prisma.media.findFirst({
      where: {
        username,
        AND: {
          title,
        },
      },
    });

    if (existsMedia) {
      throw new ConflictException();
    }

    return await this.prisma.media.create({
      data: new Media(title, username),
    });
  }

  async findAll() {
    return await this.prisma.media.findMany();
  }

  async findOne(id: number) {
    const media = await this.prisma.media.findFirst({ where: { id } });
    if (!media) throw new NotFoundException();

    return media;
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    const { title, username } = updateMediaDto;

    const media = await this.prisma.media.findFirst({ where: { id } });
    if (!media) throw new NotFoundException();

    const existsMedia = await this.prisma.media.findFirst({
      where: {
        NOT: { id },
        AND: {
          title,
          username,
        },
      },
    });

    if (existsMedia) {
      throw new ConflictException();
    }

    return await this.prisma.media.update({
      where: { id },
      data: new Media(title, username),
    });
  }

  async remove(id: number) {
    const media = await this.prisma.media.findFirst({ where: { id } });

    if (!media) throw new NotFoundException();

    const publicationsCount = await this.prisma.publication.count({
      where: { mediaId: id },
    });
    if (publicationsCount > 0)
      throw new ForbiddenException('This media is linked to a publication');

    return await this.prisma.media.delete({
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
