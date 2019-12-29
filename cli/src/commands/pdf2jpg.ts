import * as CLI from 'yargs';
import { debug } from '..';
import * as path from 'path';
import { Helper } from '../lib/process/index';
import * as bluebird from 'bluebird';

const fg = require('fast-glob');

const defaultOptions = (yargs: CLI.Argv) => {
    return yargs.option('input', {
        default: './',
        describe: 'The sources'
    }).option('debug', {
        default: 'false',
        describe: 'Enable internal debug message'
    })
};

let options = (yargs: CLI.Argv) => defaultOptions(yargs);

const convertFiles = (files) => {
    return bluebird.mapSeries(files, (file: string) => {
        const inParts = path.parse(file);
        // magick convert leg.pdf -quality 100 -density 250 -trim -flatten -resize 200% -sharpen 0x1.0 leg.jpg
        const promise = Helper.run(inParts.dir, 'convert',
        [
            inParts.base,
            '-quality 100',
            '-density 250',
            '-trim',
            '-flatten',
            '-resize 200%',
            '-sharpen 0x1.0',
            inParts.name + '.jpg'
        ]);
        return promise;
    });

}
// npm run build ; node ./build/main.js pdf2jpg --input=../drawings --output=../drawings
export const register = (cli: CLI.Argv) => {
    return cli.command('pdf2jpg', '', options, async (argv: CLI.Arguments) => {
        if (argv.help) { return; }
        const src = path.resolve('' + argv.input);
        const files = fg.sync('*.pdf', { dot: true, cwd: src, absolute: true });
        convertFiles(files);
        if (argv.debug) {
            debug(`Converted ${files.length} files`);
        }
    });
};
