import { Command, Ctx, Update } from 'nestjs-telegraf';
import { UseGuards } from '@nestjs/common';
import { Context } from '../types/context';
import { REACT_SCENE } from '../constants';
import { GroupGuard } from '../guards/group.guard';
import { ChatPointsService } from './chat.points.service';

@Update()
@UseGuards(GroupGuard)
export class ChatPointsUpdate {
    constructor(private readonly chatPointsService: ChatPointsService) {}

    @Command('react')
    async onReactCommand(@Ctx() ctx: Context) {
        await ctx.scene.enter(REACT_SCENE);
    }

    @Command('stats')
    async onStatsCommand(@Ctx() ctx: Context) {
        await this.chatPointsService.sendTotalPointsToChat(ctx);
    }
}
