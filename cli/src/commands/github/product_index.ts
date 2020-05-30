import * as CLI from 'yargs';
import * as debug from '../..';
import * as utils from '../../lib/common/strings';
import * as path from 'path';
import { files, dir, read, write, toHTML, exists, machine_header, images, gallery_image, parse_config, drawing_image } from '../../lib/';

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
    }).option('debug', {
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

        const product_rel_path = argv.product;
        const product_rel_path_name = `${path.parse(product_rel_path as string).dir}/${path.parse(product_rel_path as string).name}/`;
        
         debug.info('rel', path.parse(product_rel_path as string));
        
        // global config
        const cPath = argv.products ? path.resolve(`${argv.products}/templates/jekyll/config.json`) : path.resolve('./config.json');
        isDebug && debug.info(`read config at ${cPath}`);
        const config = read(cPath, 'json') as any;

        // jekyll machine pages root
        const machines_directory = path.resolve(`${argv.products}/_machines/`);

        const templates_path = path.resolve(`${argv.products}/templates/jekyll`);
        if (!exists(templates_path)) {
            debug.error(`\t Cant find templates at ${templates_path}, path doesn't exists`);
            return;
        }

        const template_path = path.resolve(`${templates_path}/machine.md`);


        // machine directory
        const machine_path = path.resolve(`${argv.products || config.products_path}/${argv.product}`);

        const fragments_path = path.resolve(`${templates_path}`);

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

        fragments['product_rel'] = product_rel_path_name;
        
        parse_config(fragments, machine_path);


        // compile and write out

        for (const key in fragments) {
            const resolved = utils.substitute(fragments[key], fragments);
            fragments[key] = resolved;
            if (key === 'detail') {
                // isDebug && debug.info(`resolve ${key} to ${resolved}`);
            }
        }

        for (const key in fragments) {
            const resolved = utils.substitute(fragments[key], fragments);
            fragments[key] = resolved;
        }

        let config_yaml = read(path.resolve(`${machine_path}/config.yaml`), 'string') as any || "";
        config_yaml = utils.substitute(config_yaml, fragments);

        
        if(!fragments.machine){
            debug.error(`Have no machine template! : ${machine_path} - ${templates_path}`);
            return;
        }

        const products_description = utils.substitute(fragments.machine, fragments);

        let gallery = "";
        if (fragments['gallery'] !== false && exists(path.resolve(`${machine_path}/media`))) {
            gallery = "gallery:"
            let _images = images(path.resolve(`${machine_path}/media`));
            _images = _images.map((f) => {
                let _path = `/${product_rel_path}/media/${path.parse(f).base}`;
                return `${gallery_image(_path)}`;
            }).join("") as any;
            gallery += _images;
        }

        let gallery_social = "";
        if (fragments['gallery_social'] !== false && exists(path.resolve(`${machine_path}/media/social`))) {
            gallery_social = "\ngallery_social:"
            let _images = images(path.resolve(`${machine_path}/media/social`));
            _images = _images.map((f) => {
                let _path = `/${product_rel_path}/media/social/${path.parse(f).base}`;
                return `${gallery_image(_path)}`;
            }).join("") as any;
            gallery_social += _images;
        }

        let gallery_drawings = "";
        if (fragments['gallery_drawings'] !== false && exists(path.resolve(`${machine_path}/drawings`))) {
            gallery_drawings = "\ngallery_drawings:"
            let _images = images(path.resolve(`${machine_path}/drawings`));
            debug.info(`Read drawings at ${path.resolve(`${machine_path}/drawings`)} ${_images.length}` );
            _images = _images.map((f) => {
                let _path = `/${product_rel_path}/drawings/${path.parse(f).base}`;
                let _pdf = `/${product_rel_path}/drawings/${path.parse(f).name}.PDF`;
                return `${drawing_image(_path,_pdf)}`;
            }).join("") as any;
            gallery_drawings += _images;
        }

        let content = machine_header(fragments['product_name'],
            fragments['category'],
            fragments['product_perspective'] ? fragments['product_perspective'] : `/pp/products/${fragments['slug']}/renderings/perspective.JPG`,
            fragments['slug'],
            fragments['product_rel'],
            config.description || "",
            config.tagline || "",
            config_yaml +
            gallery +
            gallery_social + 
            gallery_drawings);

        content += products_description;

        let out_path = path.resolve(`${machines_directory}/${fragments['slug']}.md`);
        isDebug && debug.info(`Write jekyll machine page ${out_path}`);
        write(out_path, content);
    });
};
