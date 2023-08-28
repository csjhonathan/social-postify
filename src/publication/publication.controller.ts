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
  Query,
  BadRequestException,
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
  findAll(
    @Query('published') published: string | null,
    @Query('after') after: string | null,
  ) {
    return this.publicationService.findAll(published, after);
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
    if (!Object.keys(updatePublicationDto).length)
      throw new BadRequestException('The request body cannot be empty!');
    return this.publicationService.update(+id, updatePublicationDto);
  }

  @Delete(':id')
  @HttpCode(httpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.publicationService.remove(+id);
  }
}
