import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TextGeneratorService } from './text.generator.service';
import { Transition, TransitionSchema } from './transition.schema';
import { Tokenizer } from './tokenizer';

@Module({
    imports: [MongooseModule.forFeature([{ name: Transition.name, schema: TransitionSchema }])],
    providers: [TextGeneratorService, Tokenizer],
    exports: [TextGeneratorService]
})
export class TextGeneratorModule {}
