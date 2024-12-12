import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './shared/guards/JwtAuth.guard';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  // Use global guards
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error for unknown properties
      transform: true, // Transform input to DTO class instances
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Adgeist')
    .setDescription('Backend for Adgeist application')
    .setVersion('1.0')
    .addTag('Adgeist')
    .addBearerAuth(
      {
        description: `Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'jwt', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    // .addGlobalParameters({
    //   in: 'header',
    //   required: false,
    //   name: 'x-refresh-token',  // refresh token header
    //   schema: {
    //     example: 'refresh_token',
    //   },
    // })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, () => console.log('Application running on 3000'));
}

bootstrap();
