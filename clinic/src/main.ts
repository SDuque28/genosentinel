import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('GenoSentinel - Microservicio Clínica')
    .setDescription(
      'API para gestión de pacientes, tipos de tumor e historias clínicas',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // ← ruta /api

  await app.listen(3000);
}
bootstrap();
