import * as CLI from 'yargs';
import { debug } from '..';
import * as utils from '../lib/common/strings';
import * as path from 'path';
import { sync as read } from '@xblox/fs/read';
import { sync as exists } from '@xblox/fs/exists';
import { sync as dir } from '@xblox/fs/dir';
import { sync as write } from '@xblox/fs/write';
import { Converter } from 'showdown';

const fg = require('fast-glob');

/***
 * todos - pipe :  
 * 1. collect & remove docusaurus meta
 * 2. remove|replace icons, styles, non - printables
 * 3. replace html with md
 * 4. replace tables with g-sheets
 * 5. replace headings
 * 6. Stencil template
 * 6.1 insert override breakers for addon content
 * 6.2 wrap sections into tabs
 * 6.3. wrap text for translation
 * 8. lint & format
 * 9. store back as raw md
 */

const defaultOptions = (yargs: CLI.Argv) => {
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

let options = (yargs: CLI.Argv) => defaultOptions(yargs);

export const convert = (input: string, data: any) => {
    input = utils.replace(input, null, (data), {
        begin: '<%',
        end: '%>'
    });

    let converter = new Converter();
    converter.setOption('literalMidWordUnderscores', 'true');
    return converter.makeHtml(input);
}

export const convertFiles = (files: string[], dst?:string) => {
    files.forEach((f) => {
        const content = read(f, 'string');
        const html = convert(content as string, {});
        if(!dst){
            dst = path.parse(f).dir;
        }
        const target = dst + path.sep + path.parse(f).name + '.html';
        debug(`\t Convert ${f} to ${target}`);
        write(target, html);
    })
}

// npm run build ; node ./build/main.js academy --input=../../academy/docs --output=../../academy-raw
export const register = (cli: CLI.Argv) => {
    return cli.command('academy', '1st pass of converting academy md files into stencil fragments', options, async (argv: CLI.Arguments) => {
        if (argv.help) { return; }
        const src = path.resolve('' + argv.input);
        const dst = path.resolve('' + argv.output);
        if (!exists(dst)) {
            dir(dst);
        }
        const files = fg.sync('*.md', { dot: true, cwd: src, absolute: true });
        convertFiles(files,dst);
        if (argv.debug) {
            debug(`Converted ${files.length} files`);
        }
    });
};
