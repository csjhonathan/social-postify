import { PrismaService } from '../../src/prisma/prisma.service';

export class TestHelper {
  async cleanDB(prisma: PrismaService) {
    await prisma.publication.deleteMany({});
    await prisma.media.deleteMany({});
    await prisma.post.deleteMany({});
  }

  suppressConsoleWarnings(callback: () => void) {
    const originalWarn = console.warn;
    console.warn = jest.fn();

    callback();

    console.warn = originalWarn;
  }
}
