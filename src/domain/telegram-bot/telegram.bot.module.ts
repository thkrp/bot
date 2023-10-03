import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { UserModule } from '../user/user.module';
import { TgUserReactionModule } from '../tg-user-reaction/tg.user.reaction.module';
import { TelegramBotService } from './telegram.bot.service';
import { TelegramBotUpdate } from './telegram.bot.update';
import { TelegrafExceptionFilter } from './exceptions/telegraf.execption.filter';
import { ChatPointsModule } from './chat-points/chat.points.module';
import { TextGenerationModule } from './text-generation/text.generation.module';

@Module({
    imports: [UserModule, TgUserReactionModule, ChatPointsModule, TextGenerationModule],
    providers: [
        {
            provide: APP_FILTER,
            useClass: TelegrafExceptionFilter
        },
        TelegramBotUpdate,
        TelegramBotService
    ],
    exports: [TelegramBotService]
})
export class TelegramBotModule {}
