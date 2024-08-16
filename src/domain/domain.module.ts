import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TelegramBotModule } from './telegram-bot/telegram.bot.module';
import { TgUserReactionModule } from './tg-user-reaction/tg.user.reaction.module';
import { TgReactionModule } from './tg-reaction/tg.reaction.module';
import { TextGeneratorModule } from './text-generator/text.generator.module';

@Module({
    imports: [TelegramBotModule, UserModule, TgReactionModule, TgUserReactionModule, TextGeneratorModule]
})
export class DomainModule {}
