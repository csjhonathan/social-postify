import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';

export class PostFactories {
  async createPost(prisma: PrismaService, qtt = 1, image = false) {
    if (qtt === 1) {
      return await prisma.post.create({
        data: {
          title: faker.person.fullName(),
          text: faker.lorem.paragraph(),
        },
      });
    }
    for (let i = 0; i < qtt; i++) {
      await prisma.post.create({
        data: {
          title: faker.person.fullName(),
          text: faker.lorem.paragraph(),
          image: image ? faker.internet.url() : null,
        },
      });
    }
  }

  async getPostById(prisma: PrismaService, id: number) {
    return await prisma.post.findUnique({ where: { id } });
  }
}
