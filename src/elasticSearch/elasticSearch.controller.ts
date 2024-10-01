import { Controller, Get, Param, Query, Body } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { SearchService } from './elasticSearch.service';

@Controller('elastic')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get('all')
  searchAllIndexes(@Query() query) {
    return this.searchService.searchAllIndexes(query);
  }
  @Public()
  @Get('suggestion')
  searchParticularIndex(@Body() req) {
    return this.searchService.searchParticularIndex(req.searchId);
  }

  @Public()
  @Get('mapping')
  createMapping() {
    return this.searchService.createMapping();
  }

  @Public()
  @Get('deleteFilm/:filmId')
  remove(@Param('filmId') param) {
    return this.searchService.remove(param);
  }
}
