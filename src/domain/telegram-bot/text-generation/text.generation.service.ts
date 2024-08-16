import { Injectable } from '@nestjs/common';
import { Context } from '../types/context';
import { GroupState, Session, SessionState } from '../types/session';
import { TextMessage } from '../types/text.message';
import { limitNumber } from '../../../util/math.utils';

@Injectable()
export class TextGenerationService {
    private readonly defaultChance = 10;
    private readonly maxChance = 100;
    private readonly minChance = 0;

    getChance(ctx: Context) {
        const groupId = ctx.message?.chat.id;
        const session = ctx.session as Session;
        const groupState = (session.state && session.state[`${groupId}`]) || ({} as GroupState);
        return groupState.chance ?? this.defaultChance;
    }

    setChance(ctx: Context, { text, chat }: TextMessage) {
        const [, str] = text.split(' ');
        const chance = Number(str);
        if (isNaN(chance)) {
            throw new Error('Only numbers from 0 to 100 are available');
        }
        const limitedChance = limitNumber(chance, this.minChance, this.maxChance);
        const groupId = chat.id;
        const session = ctx.session as Session;
        const state = session.state || ({} as SessionState);
        const groupState = (session.state && session.state[`${groupId}`]) || ({} as GroupState);

        session.state = {
            ...state,
            [`${groupId}`]: {
                ...groupState,
                chance: limitedChance
            }
        };

        return limitedChance;
    }
}
