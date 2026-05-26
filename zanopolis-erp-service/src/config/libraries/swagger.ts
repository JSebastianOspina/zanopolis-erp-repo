import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../../../package.json';

export const initializeSwagger = (app: INestApplication) => {

  const config = new DocumentBuilder()
    .setTitle('Zanopolis ERP API')
    .setVersion(version)
    .setLicense('Proprietary', 'https://ubits.com/license')
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //     description:
    //       'Ingresa el token JWT obtenido después de autenticarte. Formato: Bearer {token}',
    //   },
    //   'bearer', // Este nombre se usa en @ApiBearerAuth('bearer')
    // )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      // Genera operationId único: TemplateController_create -> createTemplate
      const controllerName = controllerKey.replace('Controller', '');
      const methodName = methodKey;
      return `${methodName}${controllerName}`;
    },
  });

  // Agregar información adicional al documento usando 'as any' para evitar problemas de tipado
  (document.info as any)['x-api-version'] = '1.0.0';
  (document.info as any)['x-supported-languages'] = ['es', 'en'];
  (document.info as any)['x-timezone-header'] = 'timezone';

  SwaggerModule.setup(`/docs`, app, document, {
    customSiteTitle: 'Zanopolis ERP API Documentation',
    customCss: '',
    swaggerOptions: {
      persistAuthorization: true, // Mantiene el token al recargar
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      tryItOutEnabled: true,
    },
  });
};
