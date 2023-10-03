import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from '../common/entity/base.entity';

@Entity({
    name: 'transition'
})
@Unique('tg_group_id_state_key', ['tgGroupId', 'state'])
export class Transition extends BaseEntity {
    @Column({
        name: 'tg_group_id',
        type: 'bigint',
        nullable: false
    })
    tgGroupId: number;

    @Column({
        name: 'state',
        type: 'varchar',
        length: 50
    })
    state: string;

    @Column({
        name: 'next',
        type: 'text',
        array: true
    })
    next: string[];
}
