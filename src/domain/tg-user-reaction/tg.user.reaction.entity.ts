import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../common/entity/base.entity';
import { TgReaction } from '../tg-reaction/tg.reaction.entity';

@Entity({
    name: 'tg_user_reaction'
})
@Unique('tg_user_id_tg_group_id_tg_reaction_owner_id_key', [
    'tgUserId',
    'tgGroupId',
    'tgReactionOwnerId',
    'tgMessageId'
])
export class TgUserReaction extends BaseEntity {
    @Column({
        name: 'tg_user_id',
        type: 'bigint',
        nullable: false
    })
    tgUserId: number;

    @Column({
        name: 'tg_group_id',
        type: 'bigint',
        nullable: false
    })
    tgGroupId?: number;

    @ManyToOne(() => TgReaction, ({ type }) => type)
    @JoinColumn({
        name: 'tg_reaction_id'
    })
    tgReaction?: TgReaction;

    @Column({
        name: 'tg_reaction_owner_id',
        type: 'bigint',
        nullable: false
    })
    tgReactionOwnerId: number;

    @Column({
        name: 'tg_message_id',
        type: 'integer',
        nullable: false
    })
    tgMessageId?: number;
}
