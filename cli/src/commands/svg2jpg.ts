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

async function convertFiles(files){
    return bluebird.mapSeries(files, (file: string) => {
        const inParts = path.parse(file);
        const promise = Helper.run(inParts.dir, 'convert',
        [
            `"${inParts.base}"`,
            '-quality 40',
            '-sharpen 0x1.0',
            `"${inParts.name}.jpg"`
        ]);
        return promise;
    });
}
//node ./build/main.js svg2jpg --input=../tests/svg/
export const register = (cli: CLI.Argv) => {
    return cli.command('svg2jpg', '', options, async (argv: CLI.Arguments) => {
        if (argv.help) { return; }
        const src = path.resolve('' + argv.input);
        const files = fg.sync('*.svg|*.SVG', { dot: true, cwd: src, absolute: true });
        if (argv.debug) {
            debug(`Begin convert SVG files at ${src} ${files}`);
        }        
        await convertFiles(files);
        if (argv.debug) {
            debug(`Converted ${files.length} files`);
        }
    });
};
