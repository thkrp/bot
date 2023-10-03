import { Module } from '@nestjs/common';
import { TgUserReactionModule } from '../../tg-user-reaction/tg.user.reaction.module';
import { TelegramBotService } from '../telegram.bot.service';
import { ChatPointsUpdate } from './chat.points.update';
import { ReactScene } from './scenes/react/react.scene';
import { ChatPointsService } from './chat.points.service';

@Module({
    imports: [TgUserReactionModule],
    providers: [ChatPointsService, ChatPointsUpdate, TelegramBotService, ReactScene]
})
export class ChatPointsModule {}
