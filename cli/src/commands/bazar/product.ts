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
    }).option('output', {
        default: './products/',
        describe: 'The output'
    }).option('debug', {
        default: 'false',
        describe: 'Enable internal debug message'
    })
};

let options = (yargs: CLI.Argv) => defaultOptions(yargs);

// npm run build ; node ./build/main.js bazar-product-html --product=elena
export const register = (cli: CLI.Argv) => {
    return cli.command('bazar-product-html', 'Creates Bazar HTML description', options, async (argv: CLI.Arguments) => {
        if (argv.help) { return; }
        
        const config = read(path.resolve('./config.json'),'json') as any;
        
        const product_path = path.resolve(`${config.products_path}/${argv.product}`);

        const bazar_fragments_path = path.resolve(`${config.fragments_path}`);
        
        debug.info(`\n Generate product description for ${argv.product}, reading from ${product_path},
            using bazar fragments at ${bazar_fragments_path}`);
        
            if(!existsSync(product_path)){
            debug.error(`\t Cant find product at ${product_path}, path doesn't exists`);
            return;
        }

        let fragments: any = {};

        // read all vendor specific fragments
        const bazar_fragment_files = fg.sync('*.html', { dot: true, cwd: bazar_fragments_path, absolute: true }) as [];
        bazar_fragment_files.map((f)=>{
            fragments[path.parse(f).name] = read(f,'string') as string;
        })

        // read all product specific fragments
        const products_fragment_files = fg.sync('*.html', { dot: true, cwd: path.resolve(`${product_path}/bazar/fragments`), absolute: true }) as [];
        products_fragment_files.map((f)=>{
            fragments[path.parse(f).name] = read(f,'string') as string;
        })


        // read product variables
        if(!existsSync(path.resolve(`${product_path}/config.json`))){
            debug.warn('product has no config');
        }else{
            const product_config = read(path.resolve(`${product_path}/config.json`),'json') as any;
            for (const key in product_config) {                
                fragments[key] =product_config[key];
            }
        }

        // compile and write out
        const products_description = utils.replace( fragments.product, null, fragments , {
            begin: '<%',
            end: '%>'
        });

        const out_path = path.resolve(`${product_path}/bazar/out/product.html`);
        debug.info(`Write product description ${out_path} `);
        write(out_path,products_description);
    
        // debug.debug("bazar fragments", fragments);
        debug.debug("bazar fragments", products_description);

    });
};
