import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';

export class PublicationFactories {
  async createPublication(
    prisma: PrismaService,
    mediaId: number,
    postId: number,
    time: 'PAST' | 'FUTURE',
    selectedDate: string | Date | undefined = undefined,
  ) {
    const date = time === 'PAST' ? faker.date.past() : faker.date.future();
    return await prisma.publication.create({
      data: {
        mediaId,
        postId,
        date: selectedDate ?? date,
      },
    });
  }

  async getPublicationById(prisma: PrismaService, id: number) {
    return await prisma.publication.findUnique({ where: { id } });
  }
}
