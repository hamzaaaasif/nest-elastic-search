import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import { json } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './auth/auth.guard';
import { ConfigService } from '@nestjs/config';

(async () => {
  Logger.log('Starting the NEST server');
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');
  app.enableCors();
  app.use(helmet());

  app.use(json({ limit: '6mb' })); //max 6mb upload is allowed
  app.useGlobalPipes(
    new ValidationPipe({
      /**
       * Strip away all none-object existing properties
       */
      whitelist: true,
      /***
       * Transform input objects to their corresponding DTO objects
       */
      transform: true,
    }),
  );
  const reflector = app.get(Reflector); //added custom reflector for public decor
  app.useGlobalGuards(new JwtAuthGuard(reflector)); //global auth guard for protecting routes
  await app.listen(port || 80);
  Logger.log(`LISTENING on Port: ${port || 80}`);
})();
