import { TelegrafModuleOptions } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { TelegrafOptionsFactory } from 'nestjs-telegraf/dist/interfaces/telegraf-options.interface';
import { Injectable } from '@nestjs/common';
import { session } from 'telegraf';

@Injectable()
export class TelegrafOptionsFactoryImpl implements TelegrafOptionsFactory {
    constructor(private readonly configService: ConfigService) {}
    createTelegrafOptions(): TelegrafModuleOptions | Promise<TelegrafModuleOptions> {
        return {
            token: this.configService.get('BOT_API_KEY') || '',
            middlewares: [session()]
        };
    }
}
