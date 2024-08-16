import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { TgReaction } from '../../tg-reaction/tg.reaction.entity';

export class CreateTgUserReactionDto {
    @IsNumber()
    @IsNotEmpty()
    tgUserId: number;

    @IsNumber()
    @IsNotEmpty()
    tgGroupId?: number;

    @IsNumber()
    @IsNotEmpty()
    tgReactionOwnerId: number;

    @IsNumber()
    @IsNotEmpty()
    tgMessageId?: number;

    @IsObject()
    tgReaction?: TgReaction;
}
