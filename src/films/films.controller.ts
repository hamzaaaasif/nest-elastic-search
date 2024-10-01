import { Controller, Get, Body, Post, Query } from '@nestjs/common';
import { Film } from './films.entity';
import { FilmService } from './films.service';

@Controller('films')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @Post('addFilm')
  addFilm(@Body() body) {
    return this.filmService.createFilm(body);
  }

  @Get('getFilm')
  getFilm(@Query() query): Promise<Film> | undefined {
    return this.filmService.getFilm(query);
  }
}
