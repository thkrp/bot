import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { Context } from '../types/context';
import { Icons } from '../../common/enums/icons.emums';

@Injectable()
export class GroupGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}
    canActivate(context: ExecutionContext): boolean {
        const groupIds = this.configService
            .get<string>('TG_GROUPS')
            ?.split(',')
            .map(id => Number(id));
        const ctx = TelegrafExecutionContext.create(context);
        const { chat } = ctx.getContext<Context>();
        const hasAccess = chat?.id ? groupIds?.includes(chat.id) : false;
        if (!hasAccess) {
            throw new TelegrafException(Icons.POUTING_FACE);
        }

        return true;
    }
}
