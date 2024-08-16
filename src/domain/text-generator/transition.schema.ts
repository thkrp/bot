import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'transition', timestamps: true, autoIndex: true })
export class Transition {
    @Prop({ nullable: false })
    tg_group_id: number;

    @Prop()
    state: string;

    @Prop()
    next: string[];
}

export const TransitionSchema = SchemaFactory.createForClass(Transition);
TransitionSchema.index({ tg_group_id: 1, state: 1 }, { unique: true });
