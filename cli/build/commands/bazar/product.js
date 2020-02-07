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
    });
};
let options = (yargs) => defaultOptions(yargs);
// npm run build ; node ./build/main.js bazar-product-html --debug=true --products=../../products --product=elena
exports.register = (cli) => {
    return cli.command('bazar-product-html', 'Creates Bazar HTML description', options, (argv) => __awaiter(void 0, void 0, void 0, function* () {
        if (argv.help) {
            return;
        }
        const format = argv.format || 'html';
        const markdown = format === 'md';
        const isDebug = argv.debug === 'true';
        const config = lib_1.read(argv.products ? path.resolve(`${argv.products}/bazar/config.json`) : path.resolve('./config.json'), 'json');
        const product_path = path.resolve(`${argv.products || config.products_path}/products/${argv.product}`);
        const bazar_fragments_path = path.resolve(`${config.fragments_path}`);
        isDebug && debug.info(`\n Generate product description for ${argv.product}, reading from ${product_path},
            using bazar fragments at ${bazar_fragments_path}`);
        if (!lib_1.exists(product_path)) {
            debug.error(`\t Cant find product at ${product_path}, path doesn't exists`);
            return;
        }
        let fragments = Object.assign({}, config);
        // read all vendor specific fragments
        let bazar_fragment_files = lib_1.files(bazar_fragments_path, '*.html');
        bazar_fragment_files.map((f) => fragments[path.parse(f).name] = lib_1.toHTML(f, markdown));
        bazar_fragment_files = lib_1.files(bazar_fragments_path, '*.md');
        bazar_fragment_files.map((f) => fragments[path.parse(f).name] = lib_1.toHTML(f, markdown));
        // read all product specific fragments
        const product_fragments_path = path.resolve(`${product_path}/bazar/fragments`);
        if (!lib_1.exists(product_fragments_path)) {
            debug.error(`Product has no bazar fragment files! Creating folder structure ..`);
            lib_1.dir(product_fragments_path);
        }
        else {
            isDebug && debug.info(`read product fragments at ${product_fragments_path}`);
        }
        let products_fragment_files = lib_1.files(product_fragments_path, '*.html');
        products_fragment_files.map((f) => fragments[path.parse(f).name] = lib_1.toHTML(f, markdown));
        products_fragment_files = lib_1.files(product_fragments_path, '*.md');
        products_fragment_files.map((f) => fragments[path.parse(f).name] = lib_1.toHTML(f, markdown));
        // read product variables
        if (!lib_1.exists(path.resolve(`${product_path}/config.json`))) {
            isDebug && debug.warn(`product has no config.json, please ensure there is a config.json in ${product_path}`);
            lib_1.write(path.resolve(`${product_path}/config.json`), '{}');
        }
        else {
            fragments = Object.assign(Object.assign({}, fragments), lib_1.read(path.resolve(`${product_path}/config.json`), 'json'));
        }
        // compile and write out
        for (const key in fragments) {
            const resolved = utils.substitute(fragments[key], fragments);
            fragments[key] = resolved;
            isDebug && debug.info(`resolve ${key} to ${resolved}`);
        }
        const products_description = utils.substitute(fragments.product, fragments);
        if (!lib_1.exists(path.resolve(`${product_path}/bazar/out/`))) {
            lib_1.dir(path.resolve(`${product_path}/bazar/out/`));
            isDebug && debug.info('created bazar/out folder in product!');
        }
        let out_path = path.resolve(`${product_path}/bazar/out/product.html`);
        isDebug && debug.info(`Write product description ${out_path}`);
        lib_1.write(out_path, products_description);
        // isDebug && debug.debug("bazar fragments", fragments);
    }));
};
//# sourceMappingURL=product.js.map