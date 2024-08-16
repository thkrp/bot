import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { getProjectRoot } from '../util/file.system.utils';

@Injectable()
export class TypeOrmOptionsFactoryImpl implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.configService.get<string>('DB_HOST'),
            port: Number(this.configService.get<string>('DB_PORT')),
            username: this.configService.get<string>('DB_USERNAME'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_DATABASE_NAME'),
            entities: [`${getProjectRoot()}/**/*.entity{.ts,.js}`],
            synchronize: false,
            migrations: [`${getProjectRoot()}/migrations/*{.ts,.js}`],
            migrationsTableName: 'migrations_history',
            migrationsRun: true
        };
    }
}
