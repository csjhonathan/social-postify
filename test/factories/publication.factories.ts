import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Publication } from '@prisma/client';

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

  buildPublication(time: 'past' | 'future'): Publication {
    return {
      id: faker.number.int(),
      date: time === 'past' ? faker.date.past() : faker.date.past(),
      mediaId: faker.number.int(),
      postId: faker.number.int(),
    };
  }

  buildPublicationToCreateOrUpdate<
    T extends {
      date: string;
      mediaId: number;
      postId: number;
    },
  >(): T {
    return {
      date: faker.date.past().toISOString(),
      mediaId: faker.number.int(),
      postId: faker.number.int(),
    } as T;
  }
}
