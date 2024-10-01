import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilmsRating } from './filmsRating.entity';

@Injectable()
export class FilmRatingService {
  constructor(
    @InjectRepository(FilmsRating)
    private readonly filmRepository: Repository<FilmsRating>,
  ) {}

  async addRating(body: Partial<FilmsRating>): Promise<FilmsRating> {
    Logger.debug('adding film : %s', JSON.stringify(body));
    try {
      const filmRating: FilmsRating = new FilmsRating();
      filmRating.rating = body.rating;
      filmRating.comment = body.comment;
      filmRating.film = body.film;

      Logger.debug('New file ==> %s', JSON.stringify(filmRating));

      await this.filmRepository.save(filmRating);
      return filmRating;
    } catch (error) {
      Logger.error('film service, adding film function error ', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
