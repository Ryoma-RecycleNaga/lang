import * as CLI from 'yargs';
import * as debug from '../..';
import * as utils from '../../lib/common/strings';
import * as path from 'path';
import { files, dir, read, write, toHTML, exists } from '../../lib/';

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
    }).option('old', {
        default: 'false',
        describe: 'output markdown for the old bazar'
    })
    .option('debug', {
        default: 'true',
        describe: 'Enable internal debug message'
    })
};

let options = (yargs: CLI.Argv) => defaultOptions(yargs);

// npm run build ; node ./build/main.js bazar-product-html --debug=true --products=../../products --product=elena
export const register = (cli: CLI.Argv) => {
    return cli.command('bazar-product-html', 'Creates Bazar HTML description', options, async (argv: CLI.Arguments) => {
        if (argv.help) { return; }

        const format = argv.format || 'html'; const markdown = format === 'md';

        const isDebug = argv.debug === 'true';

        const config = read(argv.products ? path.resolve(`${argv.products}/templates/bazar/config.json`) : path.resolve('./config.json'), 'json') as any;
        debug.info('read config at ' + path.resolve(`${argv.products}/templates/bazar/config.json`));
        if(!config){
            debug.error("can find config at " + path.resolve(`${argv.products}/templates/bazar/config.json`));
            return;
        }

        const product_path = path.resolve(`${argv.products || config.products_path}/products/${argv.product}`);
        
        const bazar_fragments_path = path.resolve(`${config.fragments_path}`);

        isDebug && debug.info(`\n Generate product description for ${argv.product}, reading from ${product_path},
            using bazar fragments at ${bazar_fragments_path}`);

        if (!exists(product_path)) {
            debug.error(`\t Cant find product at ${product_path}, path doesn't exists`);
            return;
        }

        let fragments: any = { ...config };

        // read all vendor specific fragments
        let bazar_fragment_files = files(bazar_fragments_path, '*.html');
        bazar_fragment_files.map((f) => fragments[path.parse(f).name] = toHTML(f, markdown));

        bazar_fragment_files = files(bazar_fragments_path, '*.md');
        bazar_fragment_files.map((f) => fragments[path.parse(f).name] = toHTML(f, markdown));

        // read all product specific fragments
        const product_fragments_path = path.resolve(`${product_path}/templates/bazar/fragments`);
        if (!exists(product_fragments_path)) {
            debug.error(`Product has no bazar fragment files! Creating folder structure ..`);
            dir(product_fragments_path);
        } else {
            isDebug && debug.info(`read product fragments at ${product_fragments_path}`);
        }

        let products_fragment_files = files(product_fragments_path, '*.html');
        products_fragment_files.map((f) => fragments[path.parse(f).name] = toHTML(f, markdown));

        products_fragment_files = files(product_fragments_path, '*.md');
        products_fragment_files.map((f) => fragments[path.parse(f).name] = toHTML(f, markdown));


        // read product variables
        if (!exists(path.resolve(`${product_path}/config.json`))) {
            isDebug && debug.warn(`product has no config.json, please ensure there is a config.json in ${product_path}`);
            write(path.resolve(`${product_path}/config.json`), '{}');
        } else {
            fragments = { ...fragments, ...read(path.resolve(`${product_path}/config.json`), 'json') as any }
        }

        // compile and write out

        for (const key in fragments) {
            const resolved = utils.substitute(fragments[key], fragments);
            fragments[key] = resolved;
            isDebug && debug.info(`resolve ${key} to ${resolved}`);
        }

        const products_description = utils.substitute(fragments.product, fragments);

        if(!exists(path.resolve(`${product_path}/bazar/out/`))){
            dir(path.resolve(`${product_path}/bazar/out/`));
            isDebug && debug.info('created bazar/out folder in product!');
        }
        
        let out_path = path.resolve(`${product_path}/bazar/out/product.html`);
        isDebug && debug.info(`Write product description ${out_path}`);
        write(out_path, products_description);
        // isDebug && debug.debug("bazar fragments", fragments);
    });
};
