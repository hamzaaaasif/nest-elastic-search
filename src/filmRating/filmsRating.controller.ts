import { Controller, Body, Post } from '@nestjs/common';
import { FilmsRating } from './filmsRating.entity';
import { FilmRatingService } from './filmsRating.service';

@Controller('filmsRating')
export class FilmRatingController {
  constructor(private readonly filmRatingService: FilmRatingService) {}

  @Post('addFilmRating')
  addRating(@Body() body): Promise<FilmsRating> | undefined {
    return this.filmRatingService.addRating(body);
  }
}
