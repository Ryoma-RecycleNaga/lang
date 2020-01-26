import * as CLI from 'yargs';
import * as debug from '../..';
import * as utils from '../../lib/common/strings';
import { read as readSheet } from '../../lib/net/sheets';
import * as path from 'path';
import { sync as read } from '@xblox/fs/read';
import { sync as exists } from '@xblox/fs/exists';
import { sync as dir } from '@xblox/fs/dir';
import { sync as write } from '@xblox/fs/write';
import { Converter } from 'showdown';
const fg = require('fast-glob');
import { existsSync, readSync } from 'fs';

// reads google sheet to convert BOMs to production parts

const defaultOptions = (yargs: CLI.Argv) => {
    return yargs.option('products', {
        default: './',
        describe: 'location of the products folder which contains the \'bazar\' and \'products\' folders'
    }).option('format', {
        default: 'html',
        describe: 'selects the output format, can be \'html\' or \'md\''
    }).option('debug', {
        default: 'false',
        describe: 'Enable internal debug message'
    })
};

let options = (yargs: CLI.Argv) => defaultOptions(yargs);

const files = (dir, glob) => fg.sync(glob, { dot: true, cwd: dir, absolute: true }) as [];

const readContent = (path, markdown) => {
    const content = read(path, 'string') as string;
    if (markdown) {
        let converter = new Converter();
        converter.setOption('literalMidWordUnderscores', 'true');
        return converter.makeHtml(content);
    } else {
        return content;
    }
}

// npm run build ; node ./build/main.js bazar-vendor-html --products=../../products
export const register = (cli: CLI.Argv) => {
    return cli.command('bazar-vendor-html', 'Creates Bazar vendor HTML description', options, async (argv: CLI.Arguments) => {
        if (argv.help) { return; }

        const format = argv.format || 'html'; const markdown = format === 'md';

        const isDebug = argv.debug === 'true';

        const bazarPath = path.resolve(`${argv.products}/bazar/`);

        const config = read(argv.products ? path.resolve(`${bazarPath}/config.json`) : path.resolve('./config.json'), 'json') as any;

        const bazar_fragments_path = path.resolve(`${config.fragments_path}`);

        
        let fragments: any = { ...config };

        // read all vendor specific fragments
        let bazar_fragment_files = files(bazar_fragments_path, '*.html');
        bazar_fragment_files.map((f) => fragments[path.parse(f).name] = readContent(f, markdown));

        bazar_fragment_files = files(bazar_fragments_path, '*.md');
        bazar_fragment_files.map((f) => fragments[path.parse(f).name] = readContent(f, markdown));

        // read all product specific fragments
       
        // compile and write out

        for (const key in fragments) {
            const resolved = utils.substitute(fragments[key], fragments);
            fragments[key] = resolved;
            isDebug && debug.info(`resolve ${key} to ${resolved}`);
        }

        const products_description = utils.substitute(fragments.vendor, fragments);

        if(!existsSync(path.resolve(`${bazarPath}/out/`))){
            dir(path.resolve(`${bazarPath}/out/`));
            isDebug && debug.info('created bazar/out folder!');
        }
        const out_path = path.resolve(`${bazarPath}/out/vendor.html`);
        
        isDebug && debug.info(`Write vendor description ${out_path} ${fragments.product}`);
        write(out_path, products_description);

        isDebug && debug.debug("bazar fragments", fragments);
    });
};
