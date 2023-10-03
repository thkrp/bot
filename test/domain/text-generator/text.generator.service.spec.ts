import { Test, TestingModule } from '@nestjs/testing';
import { TextGenerationService } from '../../../src/domain/telegram-bot/text-generation/text.generation.service';

describe('TgTextGenerationService', () => {
    let service: TextGenerationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TextGenerationService]
        }).compile();
        service = module.get<TextGenerationService>(TextGenerationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
