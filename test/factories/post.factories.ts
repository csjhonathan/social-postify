import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';

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
}
