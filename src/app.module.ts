import { Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from './app-config/app.config';
import { TelegrafOptionsFactoryImpl } from './app-config/telegraf.options.factory.impl';
import { TypeOrmOptionsFactoryImpl } from './app-config/typeorm.options.factory.impl';
import { DomainModule } from './domain/domain.module';

const configModuleOptions: ConfigModuleOptions = {
    envFilePath: '.env',
    isGlobal: true
};

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        AppConfig,
        TelegrafModule.forRootAsync({
            useClass: TelegrafOptionsFactoryImpl
        }),
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmOptionsFactoryImpl
        }),
        DomainModule
    ]
})
export class AppModule {}
