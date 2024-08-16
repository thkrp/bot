import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TgReactionModule } from '../tg-reaction/tg.reaction.module';
import { TgUserReactionService } from './tg.user.reaction.service';
import { TgUserReaction } from './tg.user.reaction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TgUserReaction]), TgReactionModule],
    providers: [TgUserReactionService],
    exports: [TgUserReactionService]
})
export class TgUserReactionModule {}
