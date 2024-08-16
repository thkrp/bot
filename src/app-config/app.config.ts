import { Module } from '@nestjs/common';
import { TelegrafOptionsFactoryImpl } from './telegraf.options.factory.impl';
import { TypeOrmOptionsFactoryImpl } from './typeorm.options.factory.impl';
import { MongooseOptionsFactoryImpl } from './mongoose.options.factory.impl';

@Module({
    providers: [TelegrafOptionsFactoryImpl, TypeOrmOptionsFactoryImpl, MongooseOptionsFactoryImpl],
    exports: [TelegrafOptionsFactoryImpl, TypeOrmOptionsFactoryImpl, MongooseOptionsFactoryImpl]
})
export class AppConfig {}
