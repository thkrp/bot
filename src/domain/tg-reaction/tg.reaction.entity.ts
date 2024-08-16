import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entity/base.entity';
import { TgReactionType } from '../common/enums/tg.reaction.type.enum';
import { TgUserReaction } from '../tg-user-reaction/tg.user.reaction.entity';

@Entity({
    name: 'tg_reaction'
})
export class TgReaction extends BaseEntity {
    @Column({
        name: 'type',
        type: 'enum',
        enum: TgReactionType,
        nullable: false,
        unique: true
    })
    type: TgReactionType;

    @Column({
        name: 'value',
        type: 'integer',
        nullable: false
    })
    value: number;

    @OneToMany(() => TgUserReaction, userReaction => userReaction.tgReaction)
    tgReaction: TgReaction[];
}
