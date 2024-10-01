import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmService } from './films.service';
import { FilmController } from './films.controller';
import { Film } from './films.entity';
import { SearchModule } from 'elasticSearch/elasticSearch.module';

@Module({
  providers: [FilmService],
  controllers: [FilmController],
  imports: [SearchModule, TypeOrmModule.forFeature([Film])],
})
export class FilmModule {}
