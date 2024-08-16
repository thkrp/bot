import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()
export class MongooseOptionsFactoryImpl implements MongooseOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createMongooseOptions(): Promise<MongooseModuleOptions> | MongooseModuleOptions {
        return {
            uri: `mongodb://${this.configService.get('DB_MONGO_HOST')}:${this.configService.get('DB_MONGO_PORT')}`,
            dbName: this.configService.get('DB_MONGO_DATABASE_NAME'),
            user: this.configService.get('DB_MONGO_ROOT_USER'),
            pass: this.configService.get('DB_MONGO_ROOT_PASSWORD')
        };
    }
}
