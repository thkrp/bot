import { join } from 'path';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const PostgresDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    entities: [join(__dirname, 'src', 'domain', '**', '*entity.{ts,js}')],
    migrations: [join(__dirname, 'src', 'migrations', '**', '*.{ts,js}')],
    migrationsTableName: 'migrations_history'
});
