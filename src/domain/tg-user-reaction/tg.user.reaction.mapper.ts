import { CreateTgUserReactionDto } from './dto/create.tg.user.reaction.dto';
import { TgUserReaction } from './tg.user.reaction.entity';

export class TgUserReactionMapper {
    static mapCreateTgUserReactionDtoToEntity(dto: CreateTgUserReactionDto): TgUserReaction {
        return {
            id: undefined,
            createdAt: undefined,
            updatedAt: undefined,
            tgGroupId: dto.tgGroupId,
            tgMessageId: dto.tgMessageId,
            tgReaction: dto.tgReaction,
            tgReactionOwnerId: dto.tgReactionOwnerId,
            tgUserId: dto.tgUserId
        };
    }
}
