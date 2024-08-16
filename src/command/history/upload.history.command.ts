import { Command, CommandRunner, Option } from 'nest-commander';
import { Inject } from '@nestjs/common';
import { HistoryManager } from './history.manager.interface';

@Command({
    name: 'upload-history',
    description: 'uploading telegram chat history',
    options: { isDefault: true }
})
export class UploadHistoryCommand extends CommandRunner {
    constructor(
        @Inject('HistoryManager')
        private readonly historyManager: HistoryManager
    ) {
        super();
    }
    async run(params: string[], options?: Record<string, string>): Promise<void> {
        const filename = options?.filename || 'result.json';
        await this.historyManager.uploadFromFile(filename);
    }
    @Option({
        flags: '-f --filename [filename]',
        description: 'history filename'
    })
    parseFilename(filename: string) {
        return filename;
    }
}
