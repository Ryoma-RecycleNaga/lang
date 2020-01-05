import * as CLI from 'yargs';
import { debug } from '..';
import * as utils from '../lib/common/strings';
import { crawler } from '../lib/net/crawler';

import * as path from 'path';
import { sync as read } from '@xblox/fs/read';
import { sync as exists } from '@xblox/fs/exists';
import { sync as dir } from '@xblox/fs/dir';
import { sync as write } from '@xblox/fs/write';
import { sync as rm } from '@xblox/fs/remove';
import { Converter } from 'showdown';
const fg = require('fast-glob');

/***
 * todos - pipe :  
 * 1. custom puppeteer scraper
 * 2. remove|replace icons, styles, non - printables
 * 4. how-to - parser -> md
 * 5. indexer by tags
 * 8. lint & format
 * 9. store back as raw md [how-to]/[step 1...n].md
 * 10. store github repo with raw md files
 * 
 */
const defaultOptions = (yargs: CLI.Argv) => {
    return yargs.option('output', {
        default: './',
        describe: 'The output directory'
    }).option('debug', {
        default: 'false',
        describe: 'Enable internal debug message'
    })
};

let options = (yargs: CLI.Argv) => defaultOptions(yargs);

// npm run build ; node ./build/main.js onearmy --output=../../onearmy-raw
export const register = (cli: CLI.Argv) => {
    return cli.command('onearmy', '1st pass of converting onearmy docs stencil fragments', options, async (argv: CLI.Arguments) => {
        process.env['APIFY_LOCAL_STORAGE_DIR'] = '.';
        rm(path.resolve('./request_queues'));
        if (argv.help) { return; }
        const dst = path.resolve('' + argv.output || './');
        if (!exists(dst)) {
            dir(dst);
        }
        await crawler();
        if (argv.debug) {

        }
    });
};
