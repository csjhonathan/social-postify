import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { TestHelper } from '../helpers/testHelpers';
import { MediaFactories } from '../factories/media.factories';
import { faker } from '@faker-js/faker';
import { Media } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('MediaController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();
  let server: request.SuperTest<request.Test>;
  let mediaFactories: MediaFactories;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = request(app.getHttpServer());

    mediaFactories = new MediaFactories();
    const { cleanDB } = new TestHelper();
    await cleanDB(prisma);
  });

  describe('POST /medias', () => {
    describe('when body is invalid', () => {
      it('Should not create a media and status 400', async () => {
        const { statusCode } = await server.post('/medias').send({
          title: '',
          username: '',
        });

        expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      });
    });

    describe('when body is valid', () => {
      it('Should create media and respond with created media and status 201', async () => {
        const { statusCode, body } = await server.post('/medias').send({
          title: faker.person.firstName(),
          username: faker.internet.url(),
        });

        expect(statusCode).toBe(HttpStatus.CREATED);
        expect(body).toEqual(
          expect.objectContaining<Media>({
            id: expect.any(Number),
            title: expect.any(String),
            username: expect.any(String),
          }),
        );
      });
    });
  });

  describe('GET /medias', () => {
    it('Should respond with an empty array when there are no media and status 200', async () => {
      const { statusCode, body } = await server.get('/medias');

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toEqual([]);
    });

    it('Should respond with an array of size 3 when there are 3 media and status 200', async () => {
      for (let i = 0; i < 3; i++) await mediaFactories.createMedia(prisma);
      const { statusCode, body } = await server.get('/medias');

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toHaveLength(3);
      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining<Media>({
            id: expect.any(Number),
            title: expect.any(String),
            username: expect.any(String),
          }),
        ]),
      );
    });

    describe('/:id', () => {
      it('Should respond with status 400 when id has invalid format', async () => {
        const id = faker.person.firstName();
        const { statusCode } = await server.get(`/medias/${id}`);

        expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      });

      it('Should respond with status 200 and media when id is valid', async () => {
        const media = await mediaFactories.createMedia(prisma);

        const { statusCode, body } = await server.get(`/medias/${media.id}`);

        expect(statusCode).toBe(HttpStatus.OK);
        expect(body).toEqual<Media>({
          id: media.id,
          title: media.title,
          username: media.username,
        });
      });
    });
  });

  describe('PUT /medias/:id', () => {
    it('Should respond with status 400 when id has invalid format', async () => {
      const id = faker.person.firstName();
      const { statusCode } = await server.put(`/medias/${id}`);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('Should respond with status 400 and not update a media when body is invalid', async () => {
      const media = await mediaFactories.createMedia(prisma);
      const { statusCode } = await server.put(`/medias/${media.id}`).send({
        title: '',
        username: '',
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('Should respond with status 400 and not update a media when body is empty', async () => {
      const media = await mediaFactories.createMedia(prisma);
      const { statusCode } = await server.put(`/medias/${media.id}`).send({});

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('Should respond with status 204 when id is valid', async () => {
      const { createMedia, getMediaById } = mediaFactories;

      const { id } = await createMedia(prisma);
      const title = faker.person.firstName();
      const username = faker.internet.url();
      const { statusCode } = await server.put(`/medias/${id}`).send({
        title,
        username,
      });

      const media = await getMediaById(prisma, id);

      expect(statusCode).toBe(HttpStatus.NO_CONTENT);
      expect(media).toEqual(
        expect.objectContaining<Media>({
          id,
          title,
          username,
        }),
      );
    });
  });

  describe('DELETE /medias/:id', () => {
    it('Should respond with status 400 when id has invalid format', async () => {
      const id = faker.person.firstName();
      const { statusCode } = await server.delete(`/medias/${id}`);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('Should respond with status 204', async () => {
      const { createMedia, getMediaById } = mediaFactories;
      const { id } = await createMedia(prisma);

      const { statusCode } = await server.delete(`/medias/${id}`);

      const media = await getMediaById(prisma, id);

      expect(statusCode).toBe(HttpStatus.NO_CONTENT);
      expect(media).toBe(null);
    });
  });
});
