import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService: ConfigService = app.get(ConfigService);
    await app.listen(configService.get('SERVER_PORT') || 3001);
}
bootstrap().catch(e => console.error(e));
