import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { PublicationRepository } from '../publication/publication.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly publicationsRepository: PublicationRepository,
  ) {}

  async create(createPostDto: CreatePostDto) {
    return await this.postRepository.create(createPostDto);
  }

  async findAll() {
    return await this.postRepository.findAll();
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne(id);

    if (!post) throw new NotFoundException('Post not found!');

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne(id);
    if (!post)
      throw new NotFoundException('Post not found, no updates were applied!');

    return await this.postRepository.update(id, updatePostDto);
  }

  async remove(id: number) {
    const post = await this.postRepository.findOne(id);

    if (!post) throw new NotFoundException('Post not found, no delete applied');

    const publicationsCount =
      await this.publicationsRepository.publicationCountByPostId(id);
    if (publicationsCount > 0)
      throw new ForbiddenException('This post is linked to a publication!');

    return await this.postRepository.delete(id);
  }
}
