import * as CLI from 'yargs';
import * as path from 'path';
import { existsSync, lstatSync } from 'fs';
import { files } from '../../lib';
import * as debug from '../../log';

const sanitize = require("sanitize-filename");
const filenamify = require('filenamify');
const slugify = require('slugify');
const fg = require('fast-glob');

const defaultOptions = (yargs: CLI.Argv) => {
    return yargs.option('input', {
        default: './',
        describe: 'The sources'
    }).option('slugify', {
        default: 'false',
        describe: 'convert whitespaces to dashes, remove special ASCIs'
    }).option('debug', {
        default: 'false',
        describe: 'debug messages'
    }).option('dry', {
        default: 'false',
        describe: 'dry run, dont modify'
    });
};

let options = (yargs: CLI.Argv) => defaultOptions(yargs);

const prep = (file: string) => {

    const parts = path.parse(file);
    const stats = lstatSync(file);
    if (stats.isFile()) {
        console.log('p',parts);
//        return parts.name.trim() + parts.ext.trim().split('.')[1].trim();
        return filenamify(parts.name + parts.ext);
    }
    return prep;
}

// npm run build ; node ./build/main.js sanitize-filenames --input=.
export const register = (cli: CLI.Argv) => {
    return cli.command('sanitize-filename', 'Removes invalid chars in filenames', options, async (argv: CLI.Arguments) => {
        if (argv.help) { return; }
        const _debug = argv.debug === 'true';
        const _dry = argv.dry  === 'true';
        const src = path.resolve('' + argv.input);
        _debug && debug.info(`sanitize ${src}`);
        if (existsSync(src)) {

            !_dry && sanitize(src);
            if (argv.slugify === 'true') {
                let _files = files(src, '**/**').map(prep).map(slugify);
                debug.info('files', _files);
            }
        } else {
            _debug && debug.error(`doesnt exists : ${src} `);
        }
    });
};
