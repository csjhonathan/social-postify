import { CreateMediaDto } from './dto/create-media.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaRepository {
  constructor(private prisma: PrismaService) {}

  async getMediaWithUserAndTitle(title: string, username: string) {
    return await this.prisma.media.findFirst({
      where: {
        title,
        AND: {
          username,
        },
      },
    });
  }
  async create(createMediaDto: CreateMediaDto) {
    return await this.prisma.media.create({
      data: createMediaDto,
    });
  }

  async findAll() {
    return await this.prisma.media.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.media.findFirst({ where: { id } });
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    return await this.prisma.media.update({
      where: { id },
      data: updateMediaDto,
    });
  }

  async delete(id: number) {
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
