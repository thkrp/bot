import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/entity/base.entity';
import { UserRole } from './enums/user.role.enum';

@Entity({
    name: 'app_user'
})
export class User extends BaseEntity {
    @Column({
        name: 'telegram_id',
        type: 'bigint',
        nullable: false,
        unique: true
    })
    telegramId: number;

    @Column({
        name: 'role',
        type: 'enum',
        enum: UserRole,
        nullable: false,
        default: UserRole.USER
    })
    role: UserRole = UserRole.USER;
}
