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
    return yargs.option('product', {
        default: 'elena',
        describe: 'name of the product which matches the folder name inside the products folder'
    }).option('products', {
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

// npm run build ; node ./build/main.js bazar-product-html --product=elena
export const register = (cli: CLI.Argv) => {
    return cli.command('bazar-product-html', 'Creates Bazar HTML description', options, async (argv: CLI.Arguments) => {
        if (argv.help) { return; }

        const format = argv.format || 'html'; const markdown = format === 'md';

        const isDebug = argv.debug === 'true';

        const config = read(argv.products ? path.resolve(`${argv.products}/bazar/config.json`) : path.resolve('./config.json'), 'json') as any;

        const product_path = path.resolve(`${argv.products || config.products_path}/${argv.product}`);

        const bazar_fragments_path = path.resolve(`${config.fragments_path}`);

        isDebug && debug.info(`\n Generate product description for ${argv.product}, reading from ${product_path},
            using bazar fragments at ${bazar_fragments_path}`);

        if (!existsSync(product_path)) {
            debug.error(`\t Cant find product at ${product_path}, path doesn't exists`);
            return;
        }

        let fragments: any = { ...config };

        // read all vendor specific fragments
        let bazar_fragment_files = files(bazar_fragments_path, '*.html');
        bazar_fragment_files.map((f) => fragments[path.parse(f).name] = readContent(f, markdown));

        bazar_fragment_files = files(bazar_fragments_path, '*.md');
        bazar_fragment_files.map((f) => fragments[path.parse(f).name] = readContent(f, markdown));

        // read all product specific fragments
        const product_fragments_path = path.resolve(`${product_path}/bazar/fragments`);
        if (!existsSync(product_fragments_path)) {
            debug.error(`Product has no bazar fragment files! Creating folder structure ..`);
            dir(product_fragments_path);
        } else {
            isDebug && debug.info(`read product fragments at ${product_fragments_path}`);
        }

        let products_fragment_files = files(product_fragments_path, '*.html');
        products_fragment_files.map((f) => fragments[path.parse(f).name] = readContent(f, markdown));

        products_fragment_files = files(product_fragments_path, '*.md');
        products_fragment_files.map((f) => fragments[path.parse(f).name] = readContent(f, markdown));


        // read product variables
        if (!existsSync(path.resolve(`${product_path}/config.json`))) {
            isDebug && debug.warn(`product has no config.json, please ensure there is a config.json in ${product_path}`);
            write(path.resolve(`${product_path}/config.json`), '{}');
        } else {
            fragments = { ...fragments, ...read(path.resolve(`${product_path}/config.json`), 'json') as any }
        }

        // compile and write out

        for (const key in fragments) {
            const resolved = utils.substitute(fragments[key], fragments);
            fragments[key] = resolved;
            debug.info(`resolve ${key} to ${resolved}`);
        }

        const products_description = utils.substitute(fragments.product, fragments);

        if(!existsSync(path.resolve(`${product_path}/bazar/out/`))){
            dir(path.resolve(`${product_path}/bazar/out/`));
        }
        const out_path = path.resolve(`${product_path}/bazar/out/product.html`);
        
        isDebug && debug.info(`Write product description ${out_path} ${fragments.product}`);
        write(out_path, products_description);

        isDebug && debug.debug("bazar fragments", fragments);
    });
};
