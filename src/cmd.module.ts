import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfig } from './app-config/app.config';
import { MongooseOptionsFactoryImpl } from './app-config/mongoose.options.factory.impl';
import { CommandModule } from './command/command.module';

const configModuleOptions: ConfigModuleOptions = {
    envFilePath: '.env',
    isGlobal: true
};

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        AppConfig,
        MongooseModule.forRootAsync({
            useClass: MongooseOptionsFactoryImpl
        }),
        CommandModule
    ]
})
export class CmdModule {}
