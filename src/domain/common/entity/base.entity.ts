import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import * as dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs-plugin-utc';
import { ExtendedDayjs } from '../types/extended.dayjs';
const extendedDayjs = dayjs.extend(dayjsPluginUTC) as ExtendedDayjs;

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp without time zone',
        nullable: false
    })
    createdAt?: dayjs.Dayjs = extendedDayjs.utc();

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp without time zone',
        nullable: false
    })
    updatedAt?: dayjs.Dayjs = extendedDayjs.utc();
}
