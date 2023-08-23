import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';

@Injectable()
export class MediaService {
  private medias: Media[];
  private idCount: number;
  constructor() {
    this.medias = [];
    this.idCount = 1;
  }

  create(createMediaDto: CreateMediaDto) {
    const { title, username } = createMediaDto;
    const existsMedia = this.medias.some((media) => {
      return media.title === title && media.username === username;
    });
    if (existsMedia) {
      throw new ConflictException();
    }
    const id = this.idCount;
    const media = new Media(id, title, username);
    this.medias.push(media);
    this.idCount++;
    return { id };
  }

  findAll() {
    return this.medias;
  }

  findOne(id: number) {
    const media = this.medias.find((media) => media.id === id);
    if (!media) throw new NotFoundException();
    return media;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    const { title, username } = updateMediaDto;
    const media = this.medias.find((media) => media.id === id);
    if (!media) throw new NotFoundException();

    const existsMedia = this.medias.some((media) => {
      return (
        media.title === title && media.username === username && media.id !== id
      );
    });

    if (existsMedia) {
      throw new ConflictException();
    }

    const index = media.id - 1;
    const mediaToUpdate = this.medias[index];

    mediaToUpdate.title = title;
    mediaToUpdate.username = username;

    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    const existsMedia = this.medias.some((media) => media.id === id);

    if (!existsMedia) {
      throw new NotFoundException();
    }

    this.medias = this.medias.filter((media) => media.id !== id);

    return `This action removes a #${id} media`;
  }
}
