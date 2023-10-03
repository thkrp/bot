import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TgReaction } from './tg.reaction.entity';
import { TgReactionService } from './tg.reaction.service';

@Module({
    imports: [TypeOrmModule.forFeature([TgReaction])],
    providers: [TgReactionService],
    exports: [TgReactionService]
})
export class TgReactionModule {}
