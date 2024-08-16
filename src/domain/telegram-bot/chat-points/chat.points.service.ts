import { Injectable } from '@nestjs/common';
import { CallbackQuery } from 'typegram';
import { Context } from '../types/context';
import { TgReactionType } from '../../common/enums/tg.reaction.type.enum';
import { CreateTgUserReactionDto } from '../../tg-user-reaction/dto/create.tg.user.reaction.dto';
import { Icons } from '../../common/enums/icons.emums';
import { TgUserReactionService } from '../../tg-user-reaction/tg.user.reaction.service';
import { TelegramBotService } from '../telegram.bot.service';
import { SessionState } from './scenes/react/types/session.state';

type CallbackQueryType = CallbackQuery & { data?: TgReactionType };

@Injectable()
export class ChatPointsService {
    constructor(
        private readonly tgUserReactionService: TgUserReactionService,
        private readonly telegramBotService: TelegramBotService
    ) {}

    async onReact(ctx: Context) {
        const reaction = (ctx.callbackQuery as CallbackQueryType).data as TgReactionType;
        const userId = ctx.callbackQuery?.from.id;
        const { fromId, replyToMessageId, messageOwnerId } = ctx.scene.state as SessionState;
        if (userId !== fromId) {
            return;
        }
        const chatId = ctx.callbackQuery?.message?.chat.id;
        const messageId = ctx.callbackQuery?.message?.message_id;
        const dto: CreateTgUserReactionDto = {
            tgUserId: messageOwnerId,
            tgGroupId: chatId,
            tgMessageId: replyToMessageId,
            tgReactionOwnerId: userId,
            tgReaction: undefined
        };
        try {
            await this.tgUserReactionService.reactToMessage(reaction, dto);
            await ctx.deleteMessage(messageId);
            const message = `${ctx.callbackQuery?.from.first_name || 'unknown'} reacted with ${Icons[reaction]}`;
            await ctx.reply(message, { reply_to_message_id: replyToMessageId });
        } catch (e) {
            await ctx.deleteMessage(messageId);
            throw new Error(`you have already reacted to this message ${Icons.POUTING_FACE}`);
        } finally {
            await ctx.scene.leave();
        }
    }

    async sendTotalPointsToChat(ctx: Context) {
        const chatId = ctx.message?.chat.id;
        if (!chatId) {
            throw new Error('chat unavailable');
        }
        const stats = await this.tgUserReactionService.getUserReactionStats(chatId);
        const chatUserPoints = await Promise.all(
            stats.map(async user => {
                const { user: tgUser } = await this.telegramBotService.getChatMember(chatId, user.tg_user_id);
                return `${tgUser.first_name}: ${user.chat_points}`;
            })
        );
        await ctx.replyWithHTML(`<b>Chat points:\n</b>${chatUserPoints.join('\n')}`);
    }
}
