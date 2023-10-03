import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TextGeneratorModule } from '../../text-generator/text.generator.module';
import { TelegramBotService } from '../telegram.bot.service';
import { TextGenerationService } from './text.generation.service';
import { TextGenerationUpdate } from './text.generation.update';

@Module({
    imports: [ScheduleModule.forRoot(), TextGeneratorModule],
    providers: [TextGenerationService, TextGenerationUpdate, TelegramBotService]
})
export class TextGenerationModule {}
