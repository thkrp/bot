import { CommandFactory } from 'nest-commander';
import { CmdModule } from './cmd.module';

async function bootstrap() {
    await CommandFactory.run(CmdModule, ['warn', 'error']);
}

bootstrap().catch(err => {
    console.error(`server failed to start command`, err);
    process.exit(1);
});
