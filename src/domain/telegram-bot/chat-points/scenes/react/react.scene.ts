import { Ctx, Scene, SceneEnter, Message, Action } from 'nestjs-telegraf';
import { Context } from '../../../types/context';
import { REACT_SCENE } from '../../../constants';
import { TextMessage } from '../../../types/text.message';
import { ChatPointsService } from '../../chat.points.service';
import { TgReactionType } from '../../../../common/enums/tg.reaction.type.enum';
import { ReactButtons } from './buttons/react.buttons';

@Scene(REACT_SCENE)
export class ReactScene {
    constructor(private readonly chatPointsService: ChatPointsService) {}

    @SceneEnter()
    async onSceneEnter(@Ctx() ctx: Context, @Message() message: TextMessage) {
        const replyToMessageId = message.reply_to_message?.message_id;
        if (!replyToMessageId) {
            throw Error('message not selected');
        }
        const fromId = message.from?.id;
        const messageOwnerId = message.reply_to_message?.from?.id;
        if (messageOwnerId === fromId) {
            throw new Error("you can't react to your messages");
        }
        ctx.scene.session.state = { replyToMessageId, fromId, messageOwnerId };
        await ctx.deleteMessage(ctx.message?.message_id);
        await ctx.reply('Choose your reaction', ReactButtons());
    }

    @Action([TgReactionType.LIKE, TgReactionType.DISLIKE, TgReactionType.FIRE, TgReactionType.POOP])
    async onReact(@Ctx() ctx: Context) {
        await this.chatPointsService.onReact(ctx);
    }
}
