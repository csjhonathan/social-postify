import { PrismaService } from '../../src/prisma/prisma.service';

export class TestHelper {
  async cleanDB(prisma: PrismaService) {
    await prisma.publication.deleteMany({});
    await prisma.media.deleteMany({});
    await prisma.post.deleteMany({});
  }
}
