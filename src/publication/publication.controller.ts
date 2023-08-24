import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import * as httpStatus from 'http-status';

@Controller('publications')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post()
  @HttpCode(httpStatus.CREATED)
  create(@Body() createPublicationDto: CreatePublicationDto) {
    return this.publicationService.create(createPublicationDto);
  }

  @Get()
  findAll() {
    return this.publicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.publicationService.findOne(+id);
  }

  @Put(':id')
  @HttpCode(httpStatus.NO_CONTENT)
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
  ) {
    return this.publicationService.update(+id, updatePublicationDto);
  }

  @Delete(':id')
  @HttpCode(httpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.publicationService.remove(+id);
  }
}
