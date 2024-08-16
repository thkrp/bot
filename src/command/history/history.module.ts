import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transition as Transitions, TransitionSchema } from '../../domain/text-generator/transition.schema';
import { TextGeneratorModule } from '../../domain/text-generator/text.generator.module';
import { UploadHistoryCommand } from './upload.history.command';
import { TelegramJsonHistoryManager } from './telegram-json/telegram.json.history.manager';

@Module({
    imports: [MongooseModule.forFeature([{ name: Transitions.name, schema: TransitionSchema }]), TextGeneratorModule],
    providers: [
        {
            provide: 'HistoryManager',
            useClass: TelegramJsonHistoryManager
        },
        UploadHistoryCommand
    ]
})
export class HistoryModule {}
