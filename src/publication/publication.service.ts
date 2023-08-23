import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { Publication } from './entities/publication.entity';
import { MediaService } from 'src/media/media.service';
import { PostService } from 'src/post/post.service';
import dayjs from 'dayjs';

@Injectable()
export class PublicationService {
  private publications: Publication[];
  private idCount: number;

  constructor(
    private readonly mediaService: MediaService,
    private readonly postService: PostService,
  ) {
    this.publications = [];
    this.idCount = 1;
  }

  create(createPublicationDto: CreatePublicationDto) {
    const { mediaId, postId, date } = createPublicationDto;
    const medias = this.mediaService._medias;
    const posts = this.postService._posts;

    const postExists = posts.some((post) => post._id === id);
    const mediaExists = medias.some((media) => media._id === id);

    if (!postExists || !mediaExists) {
      const message = `${!postExists && 'Post'} ${
        !mediaExists && !postExists && 'and'
      } ${!mediaExists && 'Media'} not exists!`;

      throw new NotFoundException(message);
    }

    const id = this.idCount;
    const publication = new Publication(id, mediaId, postId, date);

    this.publications.push(publication);
    this.idCount++;

    return publication;
  }

  findAll() {
    return this.publications;
  }

  findOne(id: number) {
    const publication = this.publications.find(
      (publication) => publication._id === id,
    );

    if (!publication) throw new NotFoundException();

    return publication;
  }

  update(id: number, updatePublicationDto: UpdatePublicationDto) {
    const { mediaId, postId, date } = updatePublicationDto;
    const publication = this.publications.find(
      (publication) => publication._id === id,
    );

    if (!publication) throw new NotFoundException();

    const medias = this.mediaService._medias;
    const posts = this.postService._posts;

    const postExists = posts.some((post) => post._id === id);
    const mediaExists = medias.some((media) => media._id === id);

    if (!postExists || !mediaExists) {
      const message = `${!postExists && 'Post'} ${
        !mediaExists && !postExists && 'and'
      } ${!mediaExists && 'Media'} not exists!`;

      throw new NotFoundException(message);
    }

    const currentDate = new Date(Date.now());
    const isPassed = dayjs(currentDate).isAfter(publication._date);

    if (isPassed) throw new ForbiddenException();

    publication._mediaId = mediaId;
    publication._postId = postId;
    publication._date = date;

    return `This action updates a #${id} publication`;
  }

  remove(id: number) {
    const existsPublication = this.publications.some(
      (publication) => publication._id === id,
    );

    if (!existsPublication) {
      throw new NotFoundException();
    }

    this.publications = this.publications.filter(
      (publication) => publication._id !== id,
    );

    return `This action removes a #${id} publication`;
  }

  get _publications() {
    return this.publications;
  }
}
