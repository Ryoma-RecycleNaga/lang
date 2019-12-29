import * as CLI from 'yargs';
import { defaultOptions, sanitize } from '../argv';
import { Options } from '../types';
import { render as output } from '../output';

import { debug } from '..';
import * as path from 'path';
import { sync as exists } from '@xblox/fs/exists';
import { sync as dir } from '@xblox/fs/dir';

import { Process, Helper } from '../lib/process/index';
const fg = require('fast-glob');

import * as bluebird from 'bluebird';

// no extra options, using defaults
const options = (yargs: CLI.Argv) => defaultOptions(yargs);

const convert = (file: string, dst: string) => {
    const cprocess = new Process({
        bin: 'magick'
    });
    console.log(path.parse(file));
    const inParts = path.parse(file);
    // magick convert leg.pdf -quality 100 -density 250 -trim -flatten -resize 200% -sharpen 0x1.0 leg.jpg
    const target = path.resolve(dst + '/' + inParts.name + '.jpg');
    const p = cprocess.exec('convert', {}, [
        path.resolve(file),
        '-quality 100',
        '-density 250',
        '-trim',
        '-flatten',
        '-resize 200%',
        '-sharpen 0x1.0',
        target
    ]);
}
const convertFiles = (files, dst) => {
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
        const dst = path.resolve('' + argv.output);
        if (!exists(dst)) {
            dir(dst);
        }
        const files = fg.sync('*.pdf', { dot: true, cwd: src, absolute: true });
        convertFiles(files, dst);
        if (argv.debug) {
            debug(`Converted ${files.length} files`);
        }

    });
};
