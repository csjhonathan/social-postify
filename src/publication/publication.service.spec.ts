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
import { PublicationFactories } from '../../test/factories/publication.factories';
import { MediaFactories } from '../../test/factories/media.factories';
import { PostFactories } from '../../test/factories/post.factories';

describe('PublicationService', () => {
  let publicationService: PublicationService;
  let publicationRepository: PublicationRepository;
  let postRepository: PostRepository;
  let mediaRepository: MediaRepository;
  const publicationFactories = new PublicationFactories();
  const mediaFactories = new MediaFactories();
  const postFactories = new PostFactories();

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
      postMock.mockResolvedValueOnce(postFactories.getMockedPost());

      const data: CreatePublicationDto =
        publicationFactories.buildPublicationToCreateOrUpdate();

      const promise = publicationService.create(data);

      expect(promise).rejects.toThrow(
        new NotFoundException('Media not exists!'),
      );
    });

    it('Should respond with NotFoundError with message when post not exists', () => {
      const mediaMock = jest.spyOn(mediaRepository, 'findOne');
      mediaMock.mockResolvedValueOnce(mediaFactories.getMockedMedia());

      const postMock = jest.spyOn(postRepository, 'findOne');
      postMock.mockResolvedValueOnce(null);

      const data: CreatePublicationDto =
        publicationFactories.buildPublicationToCreateOrUpdate();

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

      const data =
        publicationFactories.buildPublicationToCreateOrUpdate<CreatePublicationDto>();

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

      const data: UpdatePublicationDto =
        publicationFactories.buildPublicationToCreateOrUpdate();

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
      postMock.mockResolvedValueOnce(postFactories.getMockedPost());

      const publicationMock = jest.spyOn(publicationRepository, 'findOne');
      publicationMock.mockResolvedValueOnce(
        publicationFactories.buildPublication('past'),
      );

      const id = faker.number.int({ max: 10 });

      const data: UpdatePublicationDto =
        publicationFactories.buildPublicationToCreateOrUpdate();

      const promise = publicationService.update(id, data);

      expect(promise).rejects.toThrow(
        new NotFoundException('Media not exists!'),
      );
    });

    it('Should respond with NotFoundError with message when post not exists', () => {
      const mediaMock = jest.spyOn(mediaRepository, 'findOne');
      mediaMock.mockResolvedValueOnce(mediaFactories.getMockedMedia());

      const postMock = jest.spyOn(postRepository, 'findOne');
      postMock.mockResolvedValueOnce(null);

      const publicationMock = jest.spyOn(publicationRepository, 'findOne');
      publicationMock.mockResolvedValueOnce(
        publicationFactories.buildPublication('past'),
      );

      const id = faker.number.int({ max: 10 });

      const data: UpdatePublicationDto =
        publicationFactories.buildPublicationToCreateOrUpdate();

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
      publicationMock.mockResolvedValueOnce(
        publicationFactories.buildPublication('past'),
      );

      const id = faker.number.int({ max: 10 });

      const data: UpdatePublicationDto =
        publicationFactories.buildPublicationToCreateOrUpdate();

      const promise = publicationService.update(id, data);

      expect(promise).rejects.toThrow(
        new NotFoundException('Post and Media not exists!'),
      );
    });

    it('Should respond with a ForbiddenError when the post has already been published', () => {
      const mediaMock = jest.spyOn(mediaRepository, 'findOne');
      mediaMock.mockResolvedValueOnce(mediaFactories.getMockedMedia());

      const postMock = jest.spyOn(postRepository, 'findOne');
      postMock.mockResolvedValueOnce(postFactories.getMockedPost());

      const publicationMock = jest.spyOn(publicationRepository, 'findOne');
      publicationMock.mockResolvedValueOnce(
        publicationFactories.buildPublication('past'),
      );

      const id = faker.number.int({ max: 10 });

      const data: UpdatePublicationDto =
        publicationFactories.buildPublicationToCreateOrUpdate();

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
