import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import dayjs from 'dayjs';
import { PublicationRepository } from './publication.repository';
import { MediaRepository } from 'src/media/media.repository';
import { PostRepository } from 'src/post/post.repository';

@Injectable()
export class PublicationService {
  constructor(
    private readonly publicationRepository: PublicationRepository,
    private readonly mediaRepository: MediaRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async create(createPublicationDto: CreatePublicationDto) {
    const { mediaId, postId, date } = createPublicationDto;

    const media = await this.mediaRepository.findOne(mediaId);
    const post = await this.postRepository.findOne(postId);

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

    return await this.publicationRepository.create({ mediaId, postId, date });
  }

  async findAll() {
    return await this.publicationRepository.findAll();
  }

  async findOne(id: number) {
    const publication = await this.publicationRepository.findOne(id);

    if (!publication) throw new NotFoundException('Publication not found!');

    return publication;
  }

  async update(id: number, updatePublicationDto: UpdatePublicationDto) {
    const { mediaId, postId, date } = updatePublicationDto;

    const publication = await this.publicationRepository.findOne(id);

    if (!publication)
      throw new NotFoundException('Post not found, no updates were applied!');

    const media = await this.mediaRepository.findOne(mediaId);
    const post = await this.postRepository.findOne(postId);

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

    if (isPassed)
      throw new ForbiddenException("Publish date has passed, can't update!");

    return await this.publicationRepository.update(id, {
      mediaId,
      postId,
      date,
    });
  }

  async remove(id: number) {
    const existsPublication = await this.publicationRepository.findOne(id);

    if (!existsPublication) {
      throw new NotFoundException(
        'Publication not found, no deletion applied!',
      );
    }

    return await this.publicationRepository.delete(id);
  }
}
