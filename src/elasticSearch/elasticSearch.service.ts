import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {}

  async createIndex() {
    Logger.log('Creating elastic database index');
    const index = this.configService.get('ELASTICSEARCH_INDEX');
    const checkIndex: any = await this.esService.indices.exists({ index });
    if (checkIndex.statusCode !== 404) return;

    this.esService.indices.create({
      index,
      body: {
        mappings: {
          properties: {
            name: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256,
                },
              },
            },

            description: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256,
                },
              },
            },

            ticketPrice: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256,
                },
              },
            },

            country: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256,
                },
              },
            },

            genre: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256,
                },
              },
            },
          },
        },
        settings: {
          analysis: {
            tokenizer: {
              my_tokenizer: {
                type: 'ngram',
                min_gram: 3,
                max_gram: 10,
                token_chars: [],
              },
            },
          },
        },
      },
    });
  }

  async indexFilm(film: any) {
    Logger.log('Posting film data to elastic db');
    return await this.esService.index({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
      body: film,
    });
  }

  async getDocumentByField(
    index: string,
    field: string,
    value: any,
  ): Promise<any> {
    Logger.log('Getting document by id from elastic db');
    const doc = await this.esService.search({
      index,
      body: {
        query: {
          match_phrase: {
            [field]: value,
          },
        },
      },
    });

    return doc;
  }

  async remove(filmId: string) {
    Logger.log('Removing document by id from elastic db');
    return await this.esService.deleteByQuery({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
      body: {
        query: {
          match: {
            ['filmId']: filmId,
          },
        },
      },
    });
  }

  async searchAllIndexes({ page, limit }) {
    Logger.log('Searching from the db');
    if (!page) page = 1;
    if (!limit) limit = 50;
    const from = (page - 1) * limit;
    const doc = await this.esService.search({
      index: '_all',
      body: {
        query: {
          match_all: {},
        },
      },
      size: limit,
      from,
      max_concurrent_shard_requests: 5,
    });

    return doc;
  }

  async searchParticularIndex(searchId) {
    Logger.log('Search by id ==> %s', searchId);
    const doc = await this.esService.search({
      index: 'public_search',
      body: {
        query: {
          bool: {
            must: [
              {
                bool: {
                  should: [
                    {
                      match: {
                        searchId: `${searchId}`,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },

      max_concurrent_shard_requests: 5,
    });
    return doc;
  }

  async updateDocument(
    searchField: string,
    matchId: string,
    obj: any,
    source: string,
  ) {
    Logger.log('Updating doc at elastci database');
    const doc = await this.esService.updateByQuery({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
      body: {
        query: {
          match_phrase: {
            [searchField]: matchId,
          },
        },
        script: {
          source,
          lang: 'painless',
          params: {
            ...obj,
          },
        },
      },
    });
    return doc;
  }

  async createMapping() {
    Logger.log('Creating database mapping ');
    return this.esService.indices.create({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
      body: {
        settings: {
          analysis: {
            analyzer: {
              my_analyzer: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase', 'my_edge_ngram'],
              },
            },
            filter: {
              my_edge_ngram: {
                type: 'edge_ngram',
                min_gram: 2,
                max_gram: 20,
              },
            },
          },
        },

        mappings: {
          properties: {
            suggFilmName: {
              type: 'completion',
              analyzer: 'my_analyzer',
              preserve_separators: true,
              preserve_position_increments: true,
              max_input_length: 200,
            },
            suggDescription: {
              type: 'completion',
              analyzer: 'my_analyzer',
              preserve_separators: true,
              preserve_position_increments: true,
              max_input_length: 200,
            },
            suggTicketPrice: {
              type: 'completion',
              analyzer: 'my_analyzer',
              preserve_separators: true,
              preserve_position_increments: true,
              max_input_length: 200,
            },
            suggCountry: {
              type: 'completion',
              analyzer: 'my_analyzer',
              preserve_separators: true,
              preserve_position_increments: true,
              max_input_length: 200,
            },
            suggGenre: {
              type: 'completion',
              analyzer: 'my_analyzer',
              preserve_separators: true,
              preserve_position_increments: true,
              max_input_length: 200,
            },

            filmId: {
              type: 'text',
              analyzer: 'standard',
              search_analyzer: 'standard',
            },
            name: {
              type: 'text',
              analyzer: 'standard',
              search_analyzer: 'standard',
            },
            description: {
              type: 'text',
              analyzer: 'standard',
              search_analyzer: 'standard',
            },
            ticketPrice: {
              type: 'text',
              analyzer: 'standard',
              search_analyzer: 'standard',
            },
            country: {
              type: 'text',
              analyzer: 'standard',
              search_analyzer: 'standard',
            },
            genre: {
              type: 'text',
              analyzer: 'standard',
              search_analyzer: 'standard',
            },
          },
        },
      },
    });
  }
}
