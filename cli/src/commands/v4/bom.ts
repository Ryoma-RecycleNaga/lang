import * as CLI from 'yargs';
import { debug } from '../..';
import * as utils from '../../lib/common/strings';
import { read as readSheet } from '../../lib/net/sheets';
import * as path from 'path';
import { sync as read } from '@xblox/fs/read';
import { sync as exists } from '@xblox/fs/exists';
import { sync as dir } from '@xblox/fs/dir';
import { sync as write } from '@xblox/fs/write';
import { Converter } from 'showdown';

// reads google sheet to convert BOMs to production parts

const defaultOptions = (yargs: CLI.Argv) => {
    return yargs.option('input', {
        default: './',
        describe: 'The source'
    }).option('output', {
        default: './',
        describe: 'The output'
    }).option('debug', {
        default: 'false',
        describe: 'Enable internal debug message'
    })
};

let options = (yargs: CLI.Argv) => defaultOptions(yargs);

// npm run build ; node ./build/main.js v4-bom
export const register = (cli: CLI.Argv) => {
    return cli.command('v4-bom', 'BOM Google-Sheet to Markdown fragments', options, async (argv: CLI.Arguments) => {
        if (argv.help) { return; }
        readSheet('1oVEiGH4o3SV-mAA3Mb-WNVJMyYl4VMxLjWjrSw_ipJY', 'ElenaMargin');
    });
};
