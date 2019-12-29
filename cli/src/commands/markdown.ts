import * as CLI from 'yargs';
import { defaultOptions, sanitize } from '../argv';
import { Options } from '..';
import { render as output } from '../output';
import * as utils from '../lib/common/strings';
import * as path from 'path';
import { sync as read } from '@xblox/fs/read';

import { Converter } from 'showdown';

const fg = require('fast-glob');

const defaultOptions2 = (yargs: CLI.Argv) => {
    return yargs.option('input', {
        default: './',
        describe: 'The sources'
    }).option('output', {
        default: './',
        describe: 'The output'
    }).option('debug', {
        default: 'false',
        describe: 'Enable internal debug message'
    })
};

let options = (yargs: CLI.Argv) => defaultOptions2(yargs);

const convert = (input: string) => {
    let converter = new Converter();
    converter.setOption('literalMidWordUnderscores', 'true');
    return converter.makeHtml(input);
}

export const register = (cli: CLI.Argv) => {
    return cli.command('markdown', 'Converts md files to html using showdown', options, async (argv: CLI.Arguments) => {

        const src = path.resolve('' + argv.input);
        const dst = path.resolve('' + argv.output);
        console.log('find in ' + src);
        const files = fg.sync('*.md', { dot: true, cwd: src, absolute: true });
        console.log('files ', files);
        files.forEach((f) => {
            const content = read(f,'string');
            const html = convert(content as string);
            console.log(` File : ${f} = \n   ${content} =\n ${html}`);
        })

        if (argv.help) { return; }
        // const args = sanitize(argv) as Options;
        // output({}, args);
    });
};
