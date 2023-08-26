import { Test, TestingModule } from '@nestjs/testing';
import { MediaRepository } from '../media/media.repository';
import { PublicationRepository } from '../publication/publication.repository';
import { PrismaService } from '../prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../post/post.repository';
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { BuildMessageHelper } from '../helpers/build.message';
import { UpdatePublicationDto } from './dto/update-publication.dto';

describe('PublicationService', () => {
  let publicationService: PublicationService;
  let publicationRepository: PublicationRepository;
  let postRepository: PostRepository;
  let mediaRepository: MediaRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicationService,
        PublicationRepository,
        PostRepository,
        MediaRepository,
        PrismaService,
        BuildMessageHelper,
      ],
    }).compile();

    publicationService = module.get<PublicationService>(PublicationService);
    publicationRepository = module.get<PublicationRepository>(
      PublicationRepository,
    );
    postRepository = module.get<PostRepository>(PostRepository);
    mediaRepository = module.get<MediaRepository>(MediaRepository);

    jest.clearAllMocks();
  });

  describe('POST /publications', () => {
    it('Should respond with NotFoundError with message when media not exists', () => {
      const mediaMock = jest.spyOn(mediaRepository, 'findOne');
      mediaMock.mockResolvedValueOnce(null);

      const postMock = jest.spyOn(postRepository, 'findOne');
      postMock.mockResolvedValueOnce({
        id: faker.number.int({ max: 10 }),
        title: faker.person.firstName(),
        text: faker.lorem.lines(2),
        image: faker.internet.url(),
      });

      const data: CreatePublicationDto = {
        date: faker.date.past().toDateString(),
        mediaId: faker.number.int(),
        postId: faker.number.int(),
      };

      const promise = publicationService.create(data);

      expect(promise).rejects.toThrow(
        new NotFoundException('Media not exists!'),
      );
    });

    it('Should respond with NotFoundError with message when post not exists', () => {
      const mediaMock = jest.spyOn(mediaRepository, 'findOne');
      mediaMock.mockResolvedValueOnce({
        id: faker.number.int(),
        title: faker.person.firstName(),
        username: faker.internet.url(),
      });

      const postMock = jest.spyOn(postRepository, 'findOne');
      postMock.mockResolvedValueOnce(null);

      const data: CreatePublicationDto = {
        date: faker.date.past().toDateString(),
        mediaId: faker.number.int(),
        postId: faker.number.int(),
      };

      const promise = publicationService.create(data);

      expect(promise).rejects.toThrow(
        new NotFoundException('Post not exists!'),
      );
    });

    it('Should respond with NotFoundError with message when media and post not exists', () => {
      const mediaMock = jest.spyOn(mediaRepository, 'findOne');
      mediaMock.mockResolvedValueOnce(null);

      const postMock = jest.spyOn(postRepository, 'findOne');
      postMock.mockResolvedValueOnce(null);

      const data: CreatePublicationDto = {
        date: faker.date.past().toDateString(),
        mediaId: faker.number.int(),
        postId: faker.number.int(),
      };

      const promise = publicationService.create(data);

      expect(promise).rejects.toThrow(
        new NotFoundException('Post and Media not exists!'),
      );
    });
  });

  describe('GET /publications', () => {
    it('Should respond NotFoundError with message when publication not exists', () => {
      const publcationMock = jest.spyOn(publicationRepository, 'findOne');
      publcationMock.mockResolvedValueOnce(null);

      const id = faker.number.int({ max: 10 });

      const promise = publicationService.findOne(id);

      expect(promise).rejects.toThrow(
        new NotFoundException('Publication not found!'),
      );
    });
  });

  describe('UPDATE /publications', () => {
    it('Sould respond with NotFoundError and message when publication not exists', () => {
      const publcationMock = jest.spyOn(publicationRepository, 'findOne');
      publcationMock.mockResolvedValueOnce(null);

      const id = faker.number.int({ max: 10 });

      const data: UpdatePublicationDto = {
        date: faker.date.past().toDateString(),
        mediaId: faker.number.int(),
        postId: faker.number.int(),
      };
      const promise = publicationService.update(id, data);

      expect(promise).rejects.toThrow(
        new NotFoundException(
          'Publication not found, no updates were applied!',
        ),
      );
    });

    it('Should respond with NotFoundError with message when media not exists', () => {
      const mediaMock = jest.spyOn(mediaRepository, 'findOne');
      mediaMock.mockResolvedValueOnce(null);

      const postMock = jest.spyOn(postRepository, 'findOne');
      postMock.mockResolvedValueOnce({
        id: faker.number.int({ max: 10 }),
        title: faker.person.firstName(),
        text: faker.lorem.lines(2),
        image: faker.internet.url(),
      });

      const publicationMock = jest.spyOn(publicationRepository, 'findOne');
      publicationMock.mockResolvedValueOnce({
        id: faker.number.int({ max: 10 }),
        mediaId: faker.number.int({ max: 10 }),
        postId: faker.number.int({ max: 10 }),
        date: faker.date.past(),
      });

      const id = faker.number.int({ max: 10 });

      const data: UpdatePublicationDto = {
        date: faker.date.past().toDateString(),
        mediaId: faker.number.int(),
        postId: faker.number.int(),
      };

      const promise = publicationService.update(id, data);

      expect(promise).rejects.toThrow(
        new NotFoundException('Media not exists!'),
      );
    });

    it('Should respond with NotFoundError with message when post not exists', () => {
      const mediaMock = jest.spyOn(mediaRepository, 'findOne');
      mediaMock.mockResolvedValueOnce({
        id: faker.number.int(),
        title: faker.person.firstName(),
        username: faker.internet.url(),
      });

      const postMock = jest.spyOn(postRepository, 'findOne');
      postMock.mockResolvedValueOnce(null);

      const publicationMock = jest.spyOn(publicationRepository, 'findOne');
      publicationMock.mockResolvedValueOnce({
        id: faker.number.int({ max: 10 }),
        mediaId: faker.number.int({ max: 10 }),
        postId: faker.number.int({ max: 10 }),
        date: faker.date.past(),
      });

      const id = faker.number.int({ max: 10 });

      const data: UpdatePublicationDto = {
        date: faker.date.past().toDateString(),
        mediaId: faker.number.int(),
        postId: faker.number.int(),
      };

      const promise = publicationService.update(id, data);

      expect(promise).rejects.toThrow(
        new NotFoundException('Post not exists!'),
      );
    });

    it('Should respond with NotFoundError with message when media and post not exists', () => {
      const mediaMock = jest.spyOn(mediaRepository, 'findOne');
      mediaMock.mockResolvedValueOnce(null);

      const postMock = jest.spyOn(postRepository, 'findOne');
      postMock.mockResolvedValueOnce(null);

      const publicationMock = jest.spyOn(publicationRepository, 'findOne');
      publicationMock.mockResolvedValueOnce({
        id: faker.number.int({ max: 10 }),
        mediaId: faker.number.int({ max: 10 }),
        postId: faker.number.int({ max: 10 }),
        date: faker.date.past(),
      });

      const id = faker.number.int({ max: 10 });

      const data: UpdatePublicationDto = {
        date: faker.date.past().toDateString(),
        mediaId: faker.number.int(),
        postId: faker.number.int(),
      };

      const promise = publicationService.update(id, data);

      expect(promise).rejects.toThrow(
        new NotFoundException('Post and Media not exists!'),
      );
    });

    it('Should respond with a ForbiddenError when the post has already been published', () => {
      const mediaMock = jest.spyOn(mediaRepository, 'findOne');
      mediaMock.mockResolvedValueOnce({
        id: faker.number.int(),
        title: faker.person.firstName(),
        username: faker.internet.url(),
      });

      const postMock = jest.spyOn(postRepository, 'findOne');
      postMock.mockResolvedValueOnce({
        id: faker.number.int({ max: 10 }),
        title: faker.person.firstName(),
        text: faker.lorem.lines(2),
        image: faker.internet.url(),
      });

      const publicationMock = jest.spyOn(publicationRepository, 'findOne');
      publicationMock.mockResolvedValueOnce({
        id: faker.number.int({ max: 10 }),
        mediaId: faker.number.int({ max: 10 }),
        postId: faker.number.int({ max: 10 }),
        date: faker.date.past(),
      });

      const id = faker.number.int({ max: 10 });

      const data: UpdatePublicationDto = {
        date: faker.date.past().toDateString(),
        mediaId: faker.number.int(),
        postId: faker.number.int(),
      };

      const promise = publicationService.update(id, data);

      expect(promise).rejects.toThrow(
        new ForbiddenException("Publish date has passed, can't update!"),
      );
    });
  });

  describe('DELETE /publications', () => {
    it('Should respond with NotFoundError when publication not exists', () => {
      const publcationMock = jest.spyOn(publicationRepository, 'findOne');
      publcationMock.mockResolvedValueOnce(null);

      const id = faker.number.int({ max: 10 });

      const promise = publicationService.remove(id);

      expect(promise).rejects.toThrow(
        new NotFoundException('Publication not found, no deletion applied!'),
      );
    });
  });
});
