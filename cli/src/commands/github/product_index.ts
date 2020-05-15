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

// npm run build ; node ./build/main.js machine-jekyll --debug=true --products=../../products --product=elena
export const register = (cli: CLI.Argv) => {
    return cli.command('machine-jekyll', 'Creates Jekyll markdown page', options, async (argv: CLI.Arguments) => {
        if (argv.help) { return; }

        const markdown = true;

        const isDebug = argv.debug === 'true';

        // global config
        const cPath = argv.products ? path.resolve(`${argv.products}/templates/jekyll/config.json`) : path.resolve('./config.json');
        isDebug && debug.info(`read config at ${cPath}`);
        const config = read(cPath, 'json') as any;

        // jekyll machine pages root
        const machines_directory = path.resolve(`${argv.products}/_machines/`);

        // machine directory
        const machine_path = path.resolve(`${argv.products || config.products_path}/products/${argv.product}`);
        
        const fragments_path = path.resolve(`${config.fragments_path}`);

        debug.info(fragments_path);

        isDebug && debug.info(`\n Generate machine description for ${argv.product}, reading from ${machine_path},
            using fragments at ${fragments_path}`);

        if (!exists(machine_path)) {
            debug.error(`\t Cant find machine at ${machine_path}, path doesn't exists`);
            return;
        }

        let fragments: any = { ...config };

        // read all global fragments
        isDebug && debug.info(`Read global fragments at ${fragments_path}`);
        let bazar_fragment_files = files(fragments_path, '*.html');
        bazar_fragment_files.map((f) => fragments[path.parse(f).name] = toHTML(f, markdown));

        bazar_fragment_files = files(fragments_path, '*.md');
        bazar_fragment_files.map((f) => fragments[path.parse(f).name] = toHTML(f, markdown));

        // read all product specific fragments
        const product_fragments_path = path.resolve(`${machine_path}/templates/jekyll`);
        if (!exists(product_fragments_path)) {
            debug.error(`Machine has no template files! Creating folder structure ..`);
            dir(product_fragments_path);
        } else {
            isDebug && debug.info(`read machine fragments at ${product_fragments_path}`);
        }

        let products_fragment_files = files(product_fragments_path, '*.html');
        products_fragment_files.map((f) => fragments[path.parse(f).name] = toHTML(f, markdown));

        products_fragment_files = files(product_fragments_path, '*.md');
        products_fragment_files.map((f) => {
            fragments[path.parse(f).name] = toHTML(f, false);
            isDebug && debug.info(`\t Read ${path.parse(f).name} from  ${f}`);
        });


        // read product variables
        if (!exists(path.resolve(`${machine_path}/config.json`))) {
            isDebug && debug.warn(`product has no config.json, please ensure there is a config.json in ${machine_path}`);
            write(path.resolve(`${machine_path}/config.json`), '{}');
        } else {
            fragments = { ...fragments, ...read(path.resolve(`${machine_path}/config.json`), 'json') as any };
            isDebug && debug.info(`Loaded machine variables`);
        }

        // compile and write out

        for (const key in fragments) {
            const resolved = utils.substitute(fragments[key], fragments);
            fragments[key] = resolved;
            // isDebug && debug.info(`resolve ${key} to ${resolved}`);
        }

        let config_yaml = read(path.resolve(`${machine_path}/config.yaml`), 'string') as any || "";

        const products_description = utils.substitute(fragments.machine, fragments);
        
        let content = machine_header(fragments['product_name'],
            fragments['category'],
            `/pp/products/${fragments['slug']}/renderings/perspective.JPG`,
            fragments['slug'],
            config.description || "", 
            config.tagline || "",
            config_yaml);

        content += products_description;

        let out_path = path.resolve(`${machines_directory}/${fragments['slug']}.md`);
        isDebug && debug.info(`Write jekyll machine page ${out_path}`);
        write(out_path, content);
    });
};
