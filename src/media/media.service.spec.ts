import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';
import { MediaRepository } from './media.repository';
import { PublicationRepository } from '../publication/publication.repository';
import { PrismaService } from '../prisma/prisma.service';
import { faker } from '@faker-js/faker';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateMediaDto } from './dto/update-media.dto';

describe('MediaService', () => {
  let mediaService: MediaService;
  let mediaRepository: MediaRepository;
  let publicationRepository: PublicationRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        MediaRepository,
        PublicationRepository,
        PrismaService,
      ],
    }).compile();

    mediaService = module.get<MediaService>(MediaService);
    mediaRepository = module.get<MediaRepository>(MediaRepository);
    publicationRepository = module.get<PublicationRepository>(
      PublicationRepository,
    );
  });

  describe('POST /medias', () => {
    it('Should respond with ConflictException when media exists', async () => {
      const mediaMock = jest.spyOn(mediaRepository, 'getMediaWithUserAndTitle');
      mediaMock.mockResolvedValueOnce({
        id: faker.number.int(),
        title: faker.person.firstName(),
        username: faker.person.firstName(),
      });

      const promise = mediaService.create({
        title: faker.person.firstName(),
        username: faker.person.firstName(),
      });

      expect(promise).rejects.toThrow(
        new ConflictException('This media already exists!'),
      );
    });
  });

  describe('GET /medias/:id', () => {
    it('Should respond with NotFoundException when media dont exists', async () => {
      const mediaMock = jest.spyOn(mediaRepository, 'findOne');
      mediaMock.mockResolvedValueOnce(null);

      const promise = mediaService.findOne(faker.number.int());

      expect(promise).rejects.toThrow(
        new NotFoundException('Media not found!'),
      );
    });
  });

  describe('UPDATE /medias/:id', () => {
    it('Should respond with NotFoundException when media dont exists', async () => {
      const mediaMock = jest.spyOn(mediaRepository, 'findOne');
      mediaMock.mockResolvedValueOnce(null);
      const data: UpdateMediaDto = {
        title: faker.person.firstName(),
        username: faker.internet.url(),
      };
      const promise = mediaService.update(faker.number.int(), data);

      expect(promise).rejects.toThrow(
        new NotFoundException('Media not found, no updates were applied!'),
      );
    });
  });

  describe('UPDATE /medias/:id', () => {
    it('Should respond with NotFoundException when another media with data exists', async () => {
      const existMediaMock = jest.spyOn(mediaRepository, 'findOne');
      existMediaMock.mockResolvedValueOnce({
        id: faker.number.int(),
        title: faker.person.firstName(),
        username: faker.internet.url(),
      });

      const conflictMediaMock = jest.spyOn(
        mediaRepository,
        'getMediaWithUserAndTitle',
      );
      conflictMediaMock.mockResolvedValueOnce({
        id: faker.number.int(),
        title: faker.person.firstName(),
        username: faker.internet.url(),
      });

      const data: UpdateMediaDto = {
        title: faker.person.firstName(),
        username: faker.internet.url(),
      };
      const promise = mediaService.update(faker.number.int(), data);

      expect(promise).rejects.toThrow(
        new ConflictException('This media already exists!'),
      );
    });
  });

  describe('DELETE /medias/:id', () => {
    it('Should respond with NotFoundException when media dont exists', async () => {
      const mediaMock = jest.spyOn(mediaRepository, 'findOne');
      mediaMock.mockResolvedValueOnce(null);
      const promise = mediaService.remove(faker.number.int());

      expect(promise).rejects.toThrow(
        new NotFoundException('Media not found, no deletions were made'),
      );
    });
  });

  describe('DELETE /medias/:id', () => {
    it('Should respond with ForbiddenException when media is linked with a publication', async () => {
      const existMediaMock = jest.spyOn(mediaRepository, 'findOne');
      existMediaMock.mockResolvedValueOnce({
        id: faker.number.int(),
        title: faker.person.firstName(),
        username: faker.internet.url(),
      });
      const publcationMock = jest.spyOn(
        publicationRepository,
        'publicationCountByMediaId',
      );
      publcationMock.mockResolvedValueOnce(faker.number.int({ min: 1 }));

      const promise = mediaService.remove(faker.number.int());

      expect(promise).rejects.toThrow(
        new ForbiddenException('This media is linked to a publication'),
      );
    });
  });
});
