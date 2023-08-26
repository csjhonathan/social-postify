import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Media } from '@prisma/client';

export class MediaFactories {
  async createMedia(prisma: PrismaService) {
    return await prisma.media.create({
      data: {
        title: faker.person.fullName(),
        username: faker.internet.url(),
      },
    });
  }

  async getMediaById(prisma: PrismaService, id: number) {
    return await prisma.media.findUnique({ where: { id } });
  }

  getMockedMedia(): Media {
    return {
      id: faker.number.int(),
      title: faker.person.firstName(),
      username: faker.person.firstName(),
    };
  }

  createOrUpdateMediaMock<
    T extends { title?: string; username?: string },
  >(): T {
    return {
      title: faker.person.firstName(),
      username: faker.internet.url(),
    } as T;
  }
}
