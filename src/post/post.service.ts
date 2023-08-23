import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PublicationService } from 'src/publication/publication.service';

@Injectable()
export class PostService {
  private posts: Post[];
  private idCount: number;

  constructor(private readonlypublicationService: PublicationService) {
    this.posts = [];
    this.idCount = 1;
  }

  create(createPostDto: CreatePostDto) {
    const { title, text, image } = createPostDto;

    const id = this.idCount;
    const post = new Post(id, title, text, image);

    this.posts.push(post);
    this.idCount++;

    return post;
  }

  findAll() {
    return this.posts;
  }

  findOne(id: number) {
    const media = this.posts.find((post) => post._id === id);

    if (!media) throw new NotFoundException();

    return media;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const { title, text, image } = updatePostDto;

    const post = this.posts.find((post) => post._id === id);
    if (!post) throw new NotFoundException();

    const index = post._id - 1;
    const postToUpdate = this.posts[index];

    postToUpdate._title = title;
    postToUpdate._text = text;

    if (image !== undefined) {
      postToUpdate._image = image;
    }

    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    const existsPost = this.posts.some((post) => post._id === id);

    if (!existsPost) {
      throw new NotFoundException();
    }

    this.posts = this.posts.filter((post) => post._id !== id);

    return `This action removes a #${id} post`;
  }

  get _posts() {
    return this.posts;
  }
}
