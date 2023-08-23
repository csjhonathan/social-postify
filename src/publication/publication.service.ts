import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import dayjs from 'dayjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PublicationService {
  constructor(private prisma: PrismaService) {}

  async create(createPublicationDto: CreatePublicationDto) {
    const { mediaId, postId, date } = createPublicationDto;

    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!post || !media) {
      let message = '';

      if (!post) {
        message += 'Post ';
      }

      if (!media) {
        if (message.length > 0) {
          message += 'and ';
        }
        message += 'Media ';
      }

      message += 'not exists!';

      throw new NotFoundException(message);
    }

    return await this.prisma.publication.create({
      data: { mediaId, postId, date },
    });
  }

  async findAll() {
    return await this.prisma.publication.findMany();
  }

  async findOne(id: number) {
    const publication = await this.prisma.publication.findUnique({
      where: { id },
    });

    if (!publication) throw new NotFoundException();

    return publication;
  }

  async update(id: number, updatePublicationDto: UpdatePublicationDto) {
    const { mediaId, postId, date } = updatePublicationDto;

    const publication = await this.prisma.publication.findUnique({
      where: { id },
    });

    if (!publication) throw new NotFoundException();

    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!post || !media) {
      let message = '';

      if (!post) {
        message += 'Post ';
      }

      if (!media) {
        if (message.length > 0) {
          message += 'and ';
        }
        message += 'Media ';
      }

      message += 'not exists!';

      throw new NotFoundException(message);
    }

    const currentDate = new Date(Date.now());
    const isPassed = dayjs(currentDate).isAfter(publication.date);

    if (isPassed) throw new ForbiddenException();

    return await this.prisma.publication.update({
      where: { id },
      data: { mediaId, postId, date },
    });
  }

  async remove(id: number) {
    const existsPublication = await this.prisma.publication.findUnique({
      where: { id },
    });

    if (!existsPublication) {
      throw new NotFoundException();
    }

    return await this.prisma.publication.delete({ where: { id } });
  }
}
