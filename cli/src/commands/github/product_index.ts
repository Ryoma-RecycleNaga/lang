import * as CLI from 'yargs';
import * as debug from '../..';
import * as utils from '../../lib/common/strings';
import * as path from 'path';
import { files, dir, read, write, toHTML, exists, machine_header } from '../../lib/';

const defaultOptions = (yargs: CLI.Argv) => {
    return yargs.option('gh-product-index', {
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
    return cli.command('machine-jekyll', 'Creates Jekyll markdown page', options, async (argv: CLI.Arguments) => {
        if (argv.help) { return; }

        const markdown = true;

        const isDebug = argv.debug === 'true';

        const config = read(argv.products ? path.resolve(`${argv.products}/templates/bazar/config.json`) : path.resolve('./config.json'), 'json') as any;

        const machines_directory = path.resolve(`${argv.products}/_machines/`);

        const product_path = path.resolve(`${argv.products || config.products_path}/products/${argv.product}`);

        const bazar_fragments_path = path.resolve(`${config.fragments_path}`);

        debug.info(bazar_fragments_path);

        isDebug && debug.info(`\n Generate machine description for ${argv.product}, reading from ${product_path},
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
        const product_fragments_path = path.resolve(`${product_path}/templates/jekyll`);
        if (!exists(product_fragments_path)) {
            debug.error(`Machine has no template files! Creating folder structure ..`);
            dir(product_fragments_path);
        } else {
            isDebug && debug.info(`read machine fragments at ${product_fragments_path}`);
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

        const products_description = utils.substitute(fragments.machine, fragments);

        let content = machine_header(fragments['product_name'],
            fragments['category'],
            `/pp/products/${fragments['slug']}/media/preview.jpg`,
            fragments['slug']);

        content += products_description;

        let out_path = path.resolve(`${machines_directory}/${fragments['slug']}.md`);
        isDebug && debug.info(`Write jekyll machine page ${out_path}`);
        write(out_path, content);
    });
};
