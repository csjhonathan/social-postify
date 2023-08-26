import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { TestHelper } from '../helpers/testHelpers';
import { faker } from '@faker-js/faker';
import { PostFactories } from '../factories/post.factories';
import { MediaFactories } from '../factories/media.factories';
import { PrismaService } from '../../src/prisma/prisma.service';
import { PublicationFactories } from '../factories/publication.factories';
import { Publication } from '@prisma/client';

describe('PublicationController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();
  let server: request.SuperTest<request.Test>;
  let postFactories: PostFactories;
  let mediaFactories: MediaFactories;
  let publcationFactories: PublicationFactories;

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

    postFactories = new PostFactories();
    mediaFactories = new MediaFactories();
    publcationFactories = new PublicationFactories();
    const { cleanDB } = new TestHelper();
    await cleanDB(prisma);
  });

  describe('POST /publications', () => {
    it('When body is invalid shoud respond with BadRequest status', async () => {
      const { statusCode } = await server.post('/publications').send({
        mediaId: '',
        postId: '',
        date: '',
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('Should create a publication and respond CREATED status and publication', async () => {
      const { id: postId } = await postFactories.createPost(prisma);
      const { id: mediaId } = await mediaFactories.createMedia(prisma);
      const date = faker.date.future().toISOString();

      const { statusCode, body } = await server.post('/publications').send({
        mediaId,
        postId,
        date,
      });

      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(body).toEqual({
        id: expect.any(Number),
        date,
        postId,
        mediaId,
      });
    });
  });

  describe('GET /publications', () => {
    it('Should respond an empty array with status 200 if has not publications', async () => {
      const { statusCode, body } = await server.get('/publications');

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toEqual([]);
    });

    it('should respond an array with 3 publications and status 200', async () => {
      for (let i = 0; i < 3; i++) {
        const [{ id: postId }, { id: mediaId }] = await Promise.all([
          postFactories.createPost(prisma),
          mediaFactories.createMedia(prisma),
        ]);

        await publcationFactories.createPublication(
          prisma,
          mediaId,
          postId,
          'PAST',
        );
      }

      const { statusCode, body } = await server.get('/publications');

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toHaveLength(3);
      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining<Publication>({
            id: expect.any(Number),
            mediaId: expect.any(Number),
            postId: expect.any(Number),
            date: expect.any(String),
          }),
        ]),
      );
    });

    it('should respond an array with 3 publications and status 200 for published filter', async () => {
      for (let i = 0; i < 10; i++) {
        const [{ id: postId }, { id: mediaId }] = await Promise.all([
          postFactories.createPost(prisma),
          mediaFactories.createMedia(prisma),
        ]);
        await publcationFactories.createPublication(
          prisma,
          mediaId,
          postId,
          i + 3 >= 10 ? 'PAST' : 'FUTURE',
        );
      }

      const { statusCode, body } = await server.get(
        `/publications?published=true`,
      );

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toHaveLength(3);
      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining<Publication>({
            id: expect.any(Number),
            mediaId: expect.any(Number),
            postId: expect.any(Number),
            date: expect.any(String),
          }),
        ]),
      );
    });

    it('should respond an array with 7 publications and status 200 for after filter', async () => {
      const currentDate = new Date();
      for (let i = 0; i < 10; i++) {
        const [{ id: postId }, { id: mediaId }] = await Promise.all([
          postFactories.createPost(prisma),
          mediaFactories.createMedia(prisma),
        ]);
        await publcationFactories.createPublication(
          prisma,
          mediaId,
          postId,
          i + 3 >= 10 ? 'PAST' : 'FUTURE',
        );
      }

      const { statusCode, body } = await server.get(
        `/publications?after=${currentDate}`,
      );

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toHaveLength(7);
      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining<Publication>({
            id: expect.any(Number),
            mediaId: expect.any(Number),
            postId: expect.any(Number),
            date: expect.any(String),
          }),
        ]),
      );
    });

    it('should respond an empty array if invalid combination of after and published filter', async () => {
      const currentDate = new Date();
      for (let i = 0; i < 10; i++) {
        const [{ id: postId }, { id: mediaId }] = await Promise.all([
          postFactories.createPost(prisma),
          mediaFactories.createMedia(prisma),
        ]);
        await publcationFactories.createPublication(
          prisma,
          mediaId,
          postId,
          i + 3 >= 10 ? 'PAST' : 'FUTURE',
        );
      }

      const { statusCode, body } = await server.get(
        `/publications?published=true&after=${currentDate}`,
      );

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toHaveLength(0);
      expect(body).toEqual([]);
    });

    it('should respond an array with 3 publications and status 200 for a valid combination for published and after filter', async () => {
      const pastDate = faker.date.past();
      for (let i = 0; i < 10; i++) {
        const [{ id: postId }, { id: mediaId }] = await Promise.all([
          postFactories.createPost(prisma),
          mediaFactories.createMedia(prisma),
        ]);
        await publcationFactories.createPublication(
          prisma,
          mediaId,
          postId,
          i + 3 >= 10 ? 'PAST' : 'FUTURE',
          i + 3 >= 10 ? pastDate : undefined,
        );
      }

      const { statusCode, body } = await server.get(
        `/publications?published=true&after=${pastDate}`,
      );

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toHaveLength(3);
      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining<Publication>({
            id: expect.any(Number),
            mediaId: expect.any(Number),
            postId: expect.any(Number),
            date: expect.any(String),
          }),
        ]),
      );
    });

    it('should respond with status 400 when id format is invalid', async () => {
      const id = faker.word.adjective();
      const { statusCode } = await server.get(`/publications/${id}`);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should respond with a publication when searching for id', async () => {
      const [{ id: postId }, { id: mediaId }] = await Promise.all([
        postFactories.createPost(prisma),
        mediaFactories.createMedia(prisma),
      ]);
      const { id } = await publcationFactories.createPublication(
        prisma,
        mediaId,
        postId,
        'FUTURE',
      );

      const { statusCode, body } = await server.get(`/publications/${id}`);

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toEqual(
        expect.objectContaining<Publication>({
          id,
          mediaId,
          postId,
          date: expect.any(String),
        }),
      );
    });
  });

  describe('UPDATE /publications/:id', () => {
    it('should respond with status 400 when id format is invalid', async () => {
      const id = faker.word.adjective();
      const { statusCode } = await server.put(`/publications/${id}`);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when body format is invalid', async () => {
      const id = faker.number.int({ max: 10 });
      const { statusCode } = await server.put(`/publications/${id}`).send({
        mediaId: '',
        postId: '',
        date: '',
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 204 and update publication', async () => {
      const [
        { id: postId },
        { id: mediaId },
        { id: postId2 },
        { id: mediaId2 },
      ] = await Promise.all([
        postFactories.createPost(prisma),
        mediaFactories.createMedia(prisma),
        postFactories.createPost(prisma),
        mediaFactories.createMedia(prisma),
      ]);

      const media1 = await mediaFactories.getMediaById(prisma, mediaId2);
      console.log(media1);
      const { id } = await publcationFactories.createPublication(
        prisma,
        mediaId,
        postId,
        'FUTURE',
      );

      const newDate = faker.date.future();
      const { statusCode } = await server.put(`/publications/${id}`).send({
        mediaId: mediaId2,
        postId: postId2,
        date: newDate,
      });

      const publication = await publcationFactories.getPublicationById(
        prisma,
        id,
      );

      expect(statusCode).toBe(HttpStatus.NO_CONTENT);
      expect(publication).toEqual(
        expect.objectContaining<Publication>({
          id,
          mediaId: mediaId2,
          postId: postId2,
          date: newDate,
        }),
      );
    });
  });

  describe('DELETE /publications/:id', () => {
    it('should respond with status 400 when id format is invalid', async () => {
      const id = faker.word.adjective();
      const { statusCode } = await server.delete(`/publications/${id}`);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 204 and delete publication', async () => {
      const [{ id: postId }, { id: mediaId }] = await Promise.all([
        postFactories.createPost(prisma),
        mediaFactories.createMedia(prisma),
      ]);

      const { id } = await publcationFactories.createPublication(
        prisma,
        mediaId,
        postId,
        'FUTURE',
      );

      const { statusCode } = await server.delete(`/publications/${id}`);

      const publication = await publcationFactories.getPublicationById(
        prisma,
        id,
      );

      expect(statusCode).toBe(HttpStatus.NO_CONTENT);
      expect(publication).toBeNull();
    });
  });
});
