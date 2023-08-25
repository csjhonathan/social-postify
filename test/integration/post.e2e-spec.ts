import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TestHelper } from '../helpers/testHelpers';
import { faker } from '@faker-js/faker';
import { PostFactories } from '../factories/post.factories';
import { Post } from '@prisma/client';

describe('PostController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let server: request.SuperTest<request.Test>;
  let testHelper: TestHelper;
  let postFactories: PostFactories;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get(PrismaService);
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = request(app.getHttpServer());

    testHelper = new TestHelper();
    postFactories = new PostFactories();
  });

  beforeEach(async () => {
    await testHelper.cleanDB(prisma);
  });

  describe('POST /posts', () => {
    describe('when body is invalid ', () => {
      it('Should not create a post and status 400(without image)', async () => {
        const { statusCode } = await server.post('/posts').send({
          title: '',
          text: '',
        });

        expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      });

      it('Should not create a post and status 400(with image)', async () => {
        const { statusCode } = await server.post('/posts').send({
          title: '',
          text: '',
          image: '',
        });

        expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      });
    });

    describe('when body is valid', () => {
      it('Should create post and respond with created post and status 201 (without image)', async () => {
        const { statusCode, body } = await server.post('/posts').send({
          title: faker.person.firstName(),
          text: faker.person.firstName(),
        });

        expect(statusCode).toBe(HttpStatus.CREATED);
        expect(body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            text: expect.any(String),
          }),
        );
      });

      it('Should create post and respond with created post and status 201 (with image)', async () => {
        const { statusCode, body } = await server.post('/posts').send({
          title: faker.person.firstName(),
          text: faker.person.firstName(),
          image: faker.internet.url(),
        });

        expect(statusCode).toBe(HttpStatus.CREATED);
        expect(body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            text: expect.any(String),
          }),
        );
      });
    });
  });

  describe('GET /posts', () => {
    it('Should respond with an empty array when there are no post and status 200', async () => {
      const { statusCode, body } = await server.get('/posts');

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toEqual([]);
    });

    it('Should respond with an array of size 2 when there are 2 post and status 200 with image', async () => {
      await postFactories.createPost(prisma, 2, true);
      const { statusCode, body } = await server.get('/posts');

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toHaveLength(2);
      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            text: expect.any(String),
            image: expect.any(String),
          }),
        ]),
      );
    });

    describe('/:id', () => {
      it('Should respond with status 400 when id has invalid format', async () => {
        const id = faker.person.firstName();
        const { statusCode } = await server.get(`/posts/${id}`);

        expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      });

      it('Should respond with status 200 and post when id is valid', async () => {
        const { createPost } = postFactories;

        const post = await createPost(prisma);

        const { statusCode, body } = await server.get(`/posts/${post.id}`);

        expect(statusCode).toBe(HttpStatus.OK);
        expect(body).toEqual<Post>({
          id: post.id,
          title: post.title,
          text: post.text,
          image: post.image,
        });
      });
    });
  });

  describe('PUT /posts/:id', () => {
    it('Should respond with status 400 when id has invalid format', async () => {
      const id = faker.person.firstName();
      const { statusCode } = await server.put(`/posts/${id}`);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('Should respond with status 400 and not update a post when body is invalid', async () => {
      const post = await postFactories.createPost(prisma);
      const { statusCode } = await server.put(`/posts/${post.id}`).send({
        title: '',
        text: '',
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('Should respond with status 204 when id is valid', async () => {
      const { createPost, getPostById } = postFactories;

      const { id } = await createPost(prisma);

      const title = faker.person.firstName();
      const text = faker.person.firstName();
      const image = faker.internet.url();

      const { statusCode } = await server.put(`/posts/${id}`).send({
        title,
        text,
        image,
      });

      const post = await getPostById(prisma, id);

      expect(statusCode).toBe(HttpStatus.NO_CONTENT);
      expect(post).toEqual(
        expect.objectContaining<Post>({
          id,
          title,
          text,
          image,
        }),
      );
    });
  });

  describe('DELETE /posts/:id', () => {
    it('Should respond with status 400 when id has invalid format', async () => {
      const id = faker.person.firstName();
      const { statusCode } = await server.delete(`/posts/${id}`);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('Should respond with status 204', async () => {
      const { createPost, getPostById } = postFactories;
      const { id } = await createPost(prisma);

      const { statusCode } = await server.delete(`/posts/${id}`);

      const media = await getPostById(prisma, id);

      expect(statusCode).toBe(HttpStatus.NO_CONTENT);
      expect(media).toBe(null);
    });
  });
});
