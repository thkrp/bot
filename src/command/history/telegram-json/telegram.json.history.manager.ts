import * as fs from 'fs';
import { Writable } from 'stream';
import * as console from 'console';
import * as Chain from 'stream-chain';
import { Inject, Injectable } from '@nestjs/common';
import * as StreamArray from 'stream-json/streamers/StreamArray';
import * as Pick from 'stream-json/filters/Pick';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { HistoryManager } from '../history.manager.interface';
import { TextGeneratorService } from '../../../domain/text-generator/text.generator.service';

@Injectable()
export class TelegramJsonHistoryManager implements HistoryManager {
    #groupId: number;
    constructor(
        @Inject(TextGeneratorService)
        private readonly textGeneratorService: TextGeneratorService,
        @InjectConnection() private readonly connection: Connection
    ) {}

    async uploadFromFile(filename: string): Promise<void> {
        const client = this.connection.getClient();
        const processingStream = new Writable({
            write: async ({ key, value }, encoding, next) => {
                if (!this.#groupId) {
                    throw new Error('group id not defined');
                }
                if (this.connection.readyState !== 1) {
                    await client.connect();
                }
                if (typeof value?.text === 'string' && !value.forward_from) {
                    // eslint-disable-next-line no-console
                    console.log(`${key}`);
                    await this.textGeneratorService.saveTransitions(value.text, this.#groupId);
                }

                setTimeout(() => {
                    //Runs one at a time, need to use a callback for that part to work
                    next();
                }, 1);
            },
            //Don't skip this, as we need to operate with objects, not buffers
            objectMode: true
        });

        const fileStream = fs.createReadStream(`/usr/src/tbot/data/${filename}`);

        new Chain([
            fileStream,
            Pick.withParser({ filter: 'id' }),
            ({ name, value }) => (name === 'numberValue' ? (this.#groupId = value) : undefined)
        ]);

        new Chain([fileStream, Pick.withParser({ filter: 'messages' }), new StreamArray(), processingStream]);

        processingStream.on('finish', async () => {
            console.log('All done');
            await this.connection.close();
            process.exit(0);
        });
    }
}
