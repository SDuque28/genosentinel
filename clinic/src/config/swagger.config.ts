import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Medical Records API')
    .setDescription(
      'API REST para la gestión de registros médicos, pacientes y tipos de tumores'
    )
    .setVersion('1.0')
    .addTag('patients', 'Operaciones relacionadas con pacientes')
    .addTag('clinical-records', 'Gestión de historias clínicas')
    .addTag('tumor-types', 'Catálogo de tipos de tumores')
    .addBearerAuth() // Si usas autenticación
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Medical Records API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });
}