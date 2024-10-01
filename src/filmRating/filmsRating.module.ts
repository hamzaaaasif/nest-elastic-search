import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmRatingService } from './filmsRating.service';
import { FilmRatingController } from './filmsRating.controller';
import { FilmsRating } from './filmsRating.entity';

@Module({
  providers: [FilmRatingService],
  controllers: [FilmRatingController],
  imports: [TypeOrmModule.forFeature([FilmsRating])],
})
export class FilmRatingModule {}
