import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Post } from '@prisma/client';

export class PostFactories {
  async createPost(prisma: PrismaService, image = false) {
    return await prisma.post.create({
      data: {
        title: faker.person.fullName(),
        text: faker.lorem.paragraph(),
        image: image ? faker.internet.url() : null,
      },
    });
  }

  async getPostById(prisma: PrismaService, id: number) {
    return await prisma.post.findUnique({ where: { id } });
  }

  getMockedPost(): Post {
    return {
      id: faker.number.int(),
      title: faker.person.firstName(),
      text: faker.lorem.lines(2),
      image: faker.internet.url(),
    };
  }

  createOrUpdatePostMock<
    T extends {
      title?: string;
      text?: string;
      image?: string;
    },
  >(): T {
    return {
      title: faker.person.firstName(),
      image: faker.internet.url(),
      text: faker.lorem.lines(2),
    } as T;
  }
}
