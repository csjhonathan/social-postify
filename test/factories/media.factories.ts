import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';

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
}
