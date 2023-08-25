import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';

export class MediaFactories {
  async createMedia(prisma: PrismaService, qtt = 1) {
    if (qtt === 1) {
      return await prisma.media.create({
        data: {
          title: faker.person.fullName(),
          username: faker.internet.url(),
        },
      });
    }
    for (let i = 0; i < qtt; i++) {
      await prisma.media.create({
        data: {
          title: faker.person.fullName(),
          username: faker.internet.url(),
        },
      });
    }
  }

  async getMediaById(prisma: PrismaService, id: number) {
    return await prisma.media.findUnique({ where: { id } });
  }
}
