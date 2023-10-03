import { Markup } from 'telegraf';
import { TgReactionType } from '../../../../../common/enums/tg.reaction.type.enum';
import { Icons } from '../../../../../common/enums/icons.emums';

export const ReactButtons = () => {
    return Markup.inlineKeyboard(
        [
            Markup.button.callback(Icons.LIKE, TgReactionType.LIKE),
            Markup.button.callback(Icons.FIRE, TgReactionType.FIRE),
            Markup.button.callback(Icons.DISLIKE, TgReactionType.DISLIKE),
            Markup.button.callback(Icons.POOP, TgReactionType.POOP)
        ],
        {
            columns: 4
        }
    );
};
