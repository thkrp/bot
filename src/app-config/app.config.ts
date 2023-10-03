import { Module } from '@nestjs/common';
import { TelegrafOptionsFactoryImpl } from './telegraf.options.factory.impl';
import { TypeOrmOptionsFactoryImpl } from './typeorm.options.factory.impl';

@Module({
    providers: [TelegrafOptionsFactoryImpl, TypeOrmOptionsFactoryImpl],
    exports: [TelegrafOptionsFactoryImpl, TypeOrmOptionsFactoryImpl]
})
export class AppConfig {}
