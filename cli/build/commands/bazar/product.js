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
const read_1 = require("@xblox/fs/read");
const write_1 = require("@xblox/fs/write");
const showdown_1 = require("showdown");
const fg = require('fast-glob');
const fs_1 = require("fs");
// reads google sheet to convert BOMs to production parts
const defaultOptions = (yargs) => {
    return yargs.option('product', {
        default: 'elena',
        describe: 'name of the product which matches the folder name inside the products folder'
    }).option('debug', {
        default: 'false',
        describe: 'Enable internal debug message'
    });
};
let options = (yargs) => defaultOptions(yargs);
// npm run build ; node ./build/main.js bazar-product-html --product=elena
exports.register = (cli) => {
    return cli.command('bazar-product-html', 'Creates Bazar HTML description', options, (argv) => __awaiter(void 0, void 0, void 0, function* () {
        if (argv.help) {
            return;
        }
        const config = read_1.sync(path.resolve('./config.json'), 'json');
        const product_path = path.resolve(`${config.products_path}/${argv.product}`);
        const bazar_fragments_path = path.resolve(`${config.fragments_path}`);
        debug.info(`\n Generate product description for ${argv.product}, reading from ${product_path},
            using bazar fragments at ${bazar_fragments_path}`);
        if (!fs_1.existsSync(product_path)) {
            debug.error(`\t Cant find product at ${product_path}, path doesn't exists`);
            return;
        }
        let fragments = {};
        // read all vendor specific fragments
        let bazar_fragment_files = fg.sync('*.html', { dot: true, cwd: bazar_fragments_path, absolute: true });
        bazar_fragment_files.map((f) => {
            fragments[path.parse(f).name] = read_1.sync(f, 'string');
        });
        bazar_fragment_files = fg.sync('*.md', { dot: true, cwd: bazar_fragments_path, absolute: true });
        bazar_fragment_files.map((f) => {
            let converter = new showdown_1.Converter();
            converter.setOption('literalMidWordUnderscores', 'true');
            fragments[path.parse(f).name] = converter.makeHtml(read_1.sync(f, 'string'));
        });
        // read all product specific fragments
        const product_fragments_path = path.resolve(`${product_path}/bazar/fragments`);
        if (!fs_1.existsSync(product_fragments_path)) {
            debug.error(`Product has no bazar fragment files`);
            return;
        }
        let products_fragment_files = fg.sync('*.html', { dot: true, product_fragments_path, absolute: true });
        products_fragment_files.map((f) => {
            fragments[path.parse(f).name] = read_1.sync(f, 'string');
        });
        products_fragment_files = fg.sync('*.md', { dot: true, cwd: product_fragments_path, absolute: true });
        products_fragment_files.map((f) => {
            let converter = new showdown_1.Converter();
            converter.setOption('literalMidWordUnderscores', 'true');
            fragments[path.parse(f).name] = converter.makeHtml(read_1.sync(f, 'string'));
        });
        // read product variables
        if (!fs_1.existsSync(path.resolve(`${product_path}/config.json`))) {
            debug.warn('product has no config');
        }
        else {
            const product_config = read_1.sync(path.resolve(`${product_path}/config.json`), 'json');
            for (const key in product_config) {
                fragments[key] = product_config[key];
            }
        }
        // compile and write out
        const products_description = utils.replace(fragments.product, null, fragments, {
            begin: '<%',
            end: '%>'
        });
        const out_path = path.resolve(`${product_path}/bazar/out/product.html`);
        debug.info(`Write product description ${out_path} `);
        write_1.sync(out_path, products_description);
        debug.debug("bazar fragments", fragments);
        // debug.debug("bazar fragments", products_description);
    }));
};
//# sourceMappingURL=product.js.map