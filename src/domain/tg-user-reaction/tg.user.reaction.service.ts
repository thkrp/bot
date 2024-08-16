import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TgReactionType } from '../common/enums/tg.reaction.type.enum';
import { TgReactionService } from '../tg-reaction/tg.reaction.service';
import { TgUserReaction } from './tg.user.reaction.entity';
import { CreateTgUserReactionDto } from './dto/create.tg.user.reaction.dto';
import { TgUserReactionMapper } from './tg.user.reaction.mapper';

@Injectable()
export class TgUserReactionService {
    constructor(
        @InjectRepository(TgUserReaction)
        private readonly tgUserReactionRepository: Repository<TgUserReaction>,
        private readonly tgReactionService: TgReactionService
    ) {}

    async reactToMessage(reaction: TgReactionType, dto: CreateTgUserReactionDto) {
        const tgReaction = await this.tgReactionService.getTgReactionByType(reaction);
        if (!tgReaction) {
            throw new Error('reaction unavailable');
        }
        const entity = TgUserReactionMapper.mapCreateTgUserReactionDtoToEntity({ ...dto, tgReaction });
        const createdReaction: TgUserReaction = this.tgUserReactionRepository.create(entity);
        await this.tgUserReactionRepository.insert(createdReaction);
    }

    async getUserReactionStats(groupId: number): Promise<{ tg_user_id: number; chat_points: number }[]> {
        return await this.tgUserReactionRepository
            .createQueryBuilder('tg_user_reaction')
            .select('tg_user_reaction.tg_user_id')
            .addSelect('SUM(tg_reaction.value)', 'chat_points')
            .where('tg_user_reaction.tg_group_id=:groupId', { groupId: groupId })
            .leftJoin('tg_user_reaction.tgReaction', 'tg_reaction', 'tg_reaction.id=tg_user_reaction.tg_reaction_id')
            .groupBy('tg_user_reaction.tg_user_id')
            .orderBy('chat_points', 'DESC')
            .getRawMany();
    }
}
