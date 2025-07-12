import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { ValidationPipe } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

   const sequelize = app.get(Sequelize);
   console.log('Modelos registrados:', sequelize.modelManager.all.map(m => m.name));

  await app.listen(envs.PORT);
}
bootstrap();
