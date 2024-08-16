import { Command, Ctx, Message, On, Update } from 'nestjs-telegraf';
import { UseGuards } from '@nestjs/common';
import { GroupGuard } from '../guards/group.guard';
import { TextMessage } from '../types/text.message';
import { TextGeneratorService } from '../../text-generator/text.generator.service';
import { Context } from '../types/context';
import { TelegramBotService } from '../telegram.bot.service';
import { randomBoolean } from '../../../util/math.utils';
import { Icons } from '../../common/enums/icons.emums';
import { TextGenerationService } from './text.generation.service';

@Update()
@UseGuards(GroupGuard)
export class TextGenerationUpdate {
    constructor(
        private readonly textGeneratorService: TextGeneratorService,
        private readonly telegramBotService: TelegramBotService,
        private readonly textGenerationService: TextGenerationService
    ) {}

    @Command('get_chance')
    async onGetChance(@Ctx() ctx: Context) {
        const chance = this.textGenerationService.getChance(ctx);
        await ctx.reply(`the chance is ${chance} percent`);
    }

    @Command('set_chance')
    async onSetChance(@Ctx() ctx: Context, @Message() message: TextMessage) {
        const chance = this.textGenerationService.setChance(ctx, message);
        await ctx.reply(`the chance is set to ${chance} percent`);
    }

    @On('message')
    async onMessage(@Ctx() ctx: Context, @Message() message: TextMessage) {
        const isReplyToBot = await this.telegramBotService.isBot(message.reply_to_message?.from?.id);
        const isBotMessage = await this.telegramBotService.isBot(message.from?.id);
        const shouldReply = randomBoolean(this.textGenerationService.getChance(ctx));
        const isForward = Boolean(message.forward_from);
        const text = Boolean(message.text);
        if (isForward || !text) {
            return;
        }

        if (isReplyToBot) {
            try {
                const generated = await this.textGeneratorService.generateText(message.chat.id, message.text);
                await ctx.reply(generated || Icons.POUTING_FACE);
            } catch (e) {
                console.error(e);
                return;
            }
        }
        if (!isReplyToBot && shouldReply) {
            try {
                const generated = await this.textGeneratorService.generateText(message.chat.id, message.text);
                await ctx.reply(generated || Icons.POUTING_FACE, { reply_to_message_id: message.message_id });
            } catch (e) {
                console.error(e);
                return;
            }
        }
        if (!isBotMessage) {
            try {
                await this.textGeneratorService.saveTransitions(`${message.text}`, message.chat.id);
            } catch (e) {
                console.error(e);
                return;
            }
        }
    }
}
