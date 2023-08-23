import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediaModule } from './media/media.module';
import { PostModule } from './post/post.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [MediaModule, PostModule],
})
export class AppModule {}
