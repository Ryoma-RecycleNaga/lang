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

const defaultData = (override: any) => {
    return {
        PART_PARENT: 'my parent 2',
        PART_INVENTORY: 'inventory',
        PART_NAME: 'Front Shield',
        PART_VERSION: 1,
        PART_VERSIONS: '1 2',
        PART_ID: 'Z_4_FRONT_SHIELD',
        PART_DRAWING: 'https://a360.co/37pDdVD',
        PART_PREVIEW: '',
        PART_COMPAT: '',
        PART_CAPS: '',
        PART_ASSEMBLY: '',
        PART_TOOLS: '<div>tools - data </div>',
        PART_TEMPLATES: '',
        PART_STOCK: '',
        PART_MACHINES: '',
        PART_STEPS: '',
        PART_EDIT: '',
        PART_EDIT_ARGS: '',
        ...override
    }
};

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
    input = utils.replace(input, null, defaultData(data), {
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
// npm run build ; node ./build/main.js markdown --input=../pages --output=../out
export const register = (cli: CLI.Argv) => {
    return cli.command('markdown', 'Converts md files to html using showdown', options, async (argv: CLI.Arguments) => {
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
