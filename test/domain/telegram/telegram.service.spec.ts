import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DEFAULT_BOT_NAME } from 'nestjs-telegraf';
import { TelegramBotService } from '../../../src/domain/telegram-bot/telegram.bot.service';
import { TgUserReactionService } from '../../../src/domain/tg-user-reaction/tg.user.reaction.service';
import { TgUserReaction } from '../../../src/domain/tg-user-reaction/tg.user.reaction.entity';
import { TgReactionService } from '../../../src/domain/tg-reaction/tg.reaction.service';
import { TgReaction } from '../../../src/domain/tg-reaction/tg.reaction.entity';
import { repositoryMockFactory } from '../../helpers/repository.helper';

describe('TelegramBotService', () => {
    let service: TelegramBotService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: getRepositoryToken(TgUserReaction), useFactory: repositoryMockFactory },
                { provide: getRepositoryToken(TgReaction), useFactory: repositoryMockFactory },
                TelegramBotService,
                TgUserReactionService,
                TgReactionService,
                {
                    provide: DEFAULT_BOT_NAME,
                    useValue: 'DEFAULT_BOT_NAME'
                }
            ]
        }).compile();

        service = module.get<TelegramBotService>(TelegramBotService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
