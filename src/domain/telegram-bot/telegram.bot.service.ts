import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';
import { ChatMember } from 'typegram';

@Injectable()
export class TelegramBotService {
    constructor(@InjectBot() private bot: Telegraf) {}

    async getChatMember(chatId: number, tgUserId: number): Promise<ChatMember> {
        return await this.bot.telegram.getChatMember(chatId, tgUserId);
    }

    async isBot(id?: number) {
        const me = await this.bot.telegram.getMe();
        return id === me.id;
    }
}
