import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediaModule } from './media/media.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [MediaModule],
})
export class AppModule {}
