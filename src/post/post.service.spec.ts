import { Test, TestingModule } from '@nestjs/testing';
import { PublicationRepository } from '../publication/publication.repository';
import { PrismaService } from '../prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostService', () => {
  let postService: PostService;
  let postRepository: PostRepository;
  let publicationRepository: PublicationRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        PostRepository,
        PublicationRepository,
        PrismaService,
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    postRepository = module.get<PostRepository>(PostRepository);
    publicationRepository = module.get<PublicationRepository>(
      PublicationRepository,
    );
  });

  describe('GET /posts/:id', () => {
    it('Should respond with NotFoundException when post dont exists', async () => {
      const postMock = jest.spyOn(postRepository, 'findOne');
      postMock.mockResolvedValueOnce(null);

      const promise = postService.findOne(faker.number.int());

      expect(promise).rejects.toThrow(new NotFoundException('Post not found!'));
    });
  });

  describe('UPDATE /posts/:id', () => {
    it('Should respond with NotFoundException when post dont exists', async () => {
      const postMock = jest.spyOn(postRepository, 'findOne');
      postMock.mockResolvedValueOnce(null);

      const data: UpdatePostDto = {
        title: faker.person.firstName(),
        text: faker.person.firstName(),
      };
      const promise = postService.update(faker.number.int(), data);

      expect(promise).rejects.toThrow(
        new NotFoundException('Post not found, no updates were applied!'),
      );
    });
  });

  describe('DELETE /posts/:id', () => {
    it('Should respond with NotFoundException when post dont exists', async () => {
      const mediaMock = jest.spyOn(postRepository, 'findOne');
      mediaMock.mockResolvedValueOnce(null);

      const promise = postService.remove(faker.number.int());

      expect(promise).rejects.toThrow(
        new NotFoundException('Post not found, no delete applied'),
      );
    });
  });

  describe('DELETE /medias/:id', () => {
    it('Should respond with ForbiddenException when post is linked with a publication', async () => {
      const existMediaMock = jest.spyOn(postRepository, 'findOne');
      existMediaMock.mockResolvedValueOnce({
        id: faker.number.int(),
        title: faker.person.firstName(),
        text: faker.person.firstName(),
        image: faker.internet.url(),
      });

      const publcationMock = jest.spyOn(
        publicationRepository,
        'publicationCountByPostId',
      );
      publcationMock.mockResolvedValueOnce(faker.number.int({ min: 1 }));

      const promise = postService.remove(faker.number.int());

      expect(promise).rejects.toThrow(
        new ForbiddenException('This post is linked to a publication!'),
      );
    });
  });
});
