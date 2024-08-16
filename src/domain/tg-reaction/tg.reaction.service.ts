import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TgReactionType } from '../common/enums/tg.reaction.type.enum';
import { TgReaction } from './tg.reaction.entity';

@Injectable()
export class TgReactionService {
    constructor(
        @InjectRepository(TgReaction)
        private readonly tgReactionRepository: Repository<TgReaction>
    ) {}

    async getTgReactionByType(reaction: TgReactionType): Promise<TgReaction | null> {
        return await this.tgReactionRepository.findOne({
            where: {
                type: reaction
            }
        });
    }
}
