import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from './films.entity';
import { SearchService } from 'elasticSearch/elasticSearch.service';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(Film) private readonly filmRepository: Repository<Film>,
    private readonly searchService: SearchService,
  ) {}

  async createFilm(body: Partial<Film>) {
    Logger.debug('adding film : %s', JSON.stringify(body));
    try {
      const findfilm = await this.filmRepository.findOne({
        where: {
          name: body.name,
        },
      });
      if (findfilm)
        throw new HttpException(
          `Film with the name ${body.name} exists`,
          HttpStatus.CONFLICT,
        );
      const film: Film = new Film();
      film.name = body.name;
      film.description = body.description;
      film.releaseDate = body.releaseDate;
      film.ticketPrice = body.ticketPrice;
      film.country = body.country;
      film.genre = body.genre;
      film.photo = body.photo;

      Logger.debug('New file ==> %s', JSON.stringify(film));

      const savedFilm = await this.filmRepository.save(film);

      await this.searchService.indexFilm({ body, filmId: savedFilm.id });

      return savedFilm;
    } catch (error) {
      Logger.error('film service, adding film function error ', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getFilm({ id, name }): Promise<Film> | undefined {
    try {
      Logger.debug(`Get film by id ==> ${id} or name ==> ${name}`);
      if (!id && !name)
        throw new HttpException(
          'Id or name is required',
          HttpStatus.NOT_ACCEPTABLE,
        );
      const film = await this.filmRepository.findOne({
        where: {
          id,
          name: name,
        },
        relations: ['ratings'],
      });
      Logger.debug('Film by id ', JSON.stringify(film));
      if (!film) {
        throw new HttpException('Film not found', HttpStatus.NOT_FOUND);
      }
      return film;
    } catch (error) {
      Logger.error('filmService getFilmById error', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
