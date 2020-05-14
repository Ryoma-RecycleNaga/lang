"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("../..");
const utils = require("../../lib/common/strings");
const path = require("path");
const lib_1 = require("../../lib/");
const defaultOptions = (yargs) => {
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
    });
};
let options = (yargs) => defaultOptions(yargs);
// npm run build ; node ./build/main.js machine-jekyll --debug=true --products=../../products --product=elena
exports.register = (cli) => {
    return cli.command('machine-jekyll', 'Creates Jekyll markdown page', options, (argv) => __awaiter(void 0, void 0, void 0, function* () {
        if (argv.help) {
            return;
        }
        const markdown = true;
        const isDebug = argv.debug === 'true';
        // global config
        const cPath = argv.products ? path.resolve(`${argv.products}/templates/jekyll/config.json`) : path.resolve('./config.json');
        isDebug && debug.info(`read config at ${cPath}`);
        const config = lib_1.read(cPath, 'json');
        // jekyll machine pages root
        const machines_directory = path.resolve(`${argv.products}/_machines/`);
        // machine directory
        const machine_path = path.resolve(`${argv.products || config.products_path}/products/${argv.product}`);
        const fragments_path = path.resolve(`${config.fragments_path}`);
        debug.info(fragments_path);
        isDebug && debug.info(`\n Generate machine description for ${argv.product}, reading from ${machine_path},
            using fragments at ${fragments_path}`);
        if (!lib_1.exists(machine_path)) {
            debug.error(`\t Cant find machine at ${machine_path}, path doesn't exists`);
            return;
        }
        let fragments = Object.assign({}, config);
        // read all global fragments
        isDebug && debug.info(`Read global fragments at ${fragments_path}`);
        let bazar_fragment_files = lib_1.files(fragments_path, '*.html');
        bazar_fragment_files.map((f) => fragments[path.parse(f).name] = lib_1.toHTML(f, markdown));
        bazar_fragment_files = lib_1.files(fragments_path, '*.md');
        bazar_fragment_files.map((f) => fragments[path.parse(f).name] = lib_1.toHTML(f, markdown));
        // read all product specific fragments
        const product_fragments_path = path.resolve(`${machine_path}/templates/jekyll`);
        if (!lib_1.exists(product_fragments_path)) {
            debug.error(`Machine has no template files! Creating folder structure ..`);
            lib_1.dir(product_fragments_path);
        }
        else {
            isDebug && debug.info(`read machine fragments at ${product_fragments_path}`);
        }
        let products_fragment_files = lib_1.files(product_fragments_path, '*.html');
        products_fragment_files.map((f) => fragments[path.parse(f).name] = lib_1.toHTML(f, markdown));
        products_fragment_files = lib_1.files(product_fragments_path, '*.md');
        products_fragment_files.map((f) => {
            fragments[path.parse(f).name] = lib_1.toHTML(f, false);
            isDebug && debug.info(`\t Read ${path.parse(f).name} from  ${f}`);
        });
        // read product variables
        if (!lib_1.exists(path.resolve(`${machine_path}/config.json`))) {
            isDebug && debug.warn(`product has no config.json, please ensure there is a config.json in ${machine_path}`);
            lib_1.write(path.resolve(`${machine_path}/config.json`), '{}');
        }
        else {
            fragments = Object.assign(Object.assign({}, fragments), lib_1.read(path.resolve(`${machine_path}/config.json`), 'json'));
            isDebug && debug.info(`Loaded machine variables`);
        }
        // compile and write out
        for (const key in fragments) {
            const resolved = utils.substitute(fragments[key], fragments);
            fragments[key] = resolved;
            // isDebug && debug.info(`resolve ${key} to ${resolved}`);
        }
        let config_yaml = lib_1.read(path.resolve(`${machine_path}/config.yaml`), 'string') || "";
        const products_description = utils.substitute(fragments.machine, fragments);
        let content = lib_1.machine_header(fragments['product_name'], fragments['category'], `/pp/products/${fragments['slug']}/media/preview.jpg`, fragments['slug'], config.description || "", config.tagline || "", config_yaml);
        content += products_description;
        let out_path = path.resolve(`${machines_directory}/${fragments['slug']}.md`);
        isDebug && debug.info(`Write jekyll machine page ${out_path}`);
        lib_1.write(out_path, content);
    }));
};
//# sourceMappingURL=product_index.js.map