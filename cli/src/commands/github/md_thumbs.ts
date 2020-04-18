import * as CLI from 'yargs';
import * as debug from '../..';
import * as path from 'path';
import { write, exists, thumbs, images, resize_images } from '../../lib/';

const defaultOptions = (yargs: CLI.Argv) => {
    return yargs.option('source', {
        default: '.',
        describe: ''
    }).option('resize', {
        default: 'false',
        describe: 'resize images'
    }).option('outfile', {
        default: 'thumb.md',
        describe: 'the name of the output file'
    })
};

let options = (yargs: CLI.Argv) => defaultOptions(yargs);


// node ./build/main.js md:thumbs --debug=true --source=../../products/howto/controlbox/media
export const register = (cli: CLI.Argv) => {

    return cli.command('md:thumbs', 'Create a thumbnail grid from the current directory ', options, async (argv: CLI.Arguments) => {

        if (argv.help) { return; }

        const isDebug = argv.debug === 'true';
        const resize = argv.resize === 'true';

        const source_path = path.resolve(argv.source as any);
        const target_path = `${source_path}/${argv.outfile}`;

        isDebug && debug.info(`\n Generate thumbs from ${source_path} to ${target_path}`);

        if (!exists(source_path)) {
            debug.error(`\t Cant find at ${source_path}, path doesn't exists`);
            return;
        }
        resize && await resize_images(images(source_path));
        write(target_path, thumbs(source_path,true) );
    });
};

