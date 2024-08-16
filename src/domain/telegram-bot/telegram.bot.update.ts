import { Update, Ctx, Command, Sender, Message } from 'nestjs-telegraf';
import { UserService } from '../user/user.service';
import { Context } from './types/context';
import { TelegramUser } from './types/telegram.user';
import { TextMessage } from './types/text.message';

@Update()
// public commands
export class TelegramBotUpdate {
    constructor(private readonly userService: UserService) {}

    @Command('subscribe')
    async onSubscribeCommand(@Ctx() ctx: Context, @Sender() { id: telegramUserId }: TelegramUser) {
        try {
            await this.userService.subscribe(telegramUserId);
            await ctx.reply("you've just subscribed to the bot");
        } catch (e) {
            throw e;
        }
    }

    @Command('get_group_id')
    async onGetGroupId(@Ctx() ctx: Context, @Message() message: TextMessage) {
        await ctx.reply(message.chat.id.toString());
    }
}
