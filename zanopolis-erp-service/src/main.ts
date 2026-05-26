import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeSwagger } from './config/libraries/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  initializeSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Error bootstrapping application:', err);
});
