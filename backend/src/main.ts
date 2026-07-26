import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import{ValidationPipe} from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const swaggerConfig = new DocumentBuilder()
  .setTitle('Users CRUD API')
  .setDescription(
    'API documentation for the users CRUD assignment',
  )
  .setVersion('1.0')
  .build();

const swaggerDocument = SwaggerModule.createDocument(
  app,
  swaggerConfig,
);

SwaggerModule.setup('api', app, swaggerDocument);

  app.enableCors({
    origin:"http://localhost:4200",
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted: true,
      transform:true,
    })
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
