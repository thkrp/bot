import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextGeneratorService } from './text.generator.service';
import { Transition } from './transition.entity';
import { Tokenizer } from './tokenizer';

@Module({
    imports: [TypeOrmModule.forFeature([Transition])],
    providers: [TextGeneratorService, Tokenizer],
    exports: [TextGeneratorService]
})
export class TextGeneratorModule {}
