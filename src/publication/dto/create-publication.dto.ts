import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePublicationDto {
  @IsNotEmpty()
  @IsNumber()
  mediaId: number;

  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @IsNotEmpty()
  @IsString()
  @IsDateString()
  date: string;
}
