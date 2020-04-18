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
const path = require("path");
const lib_1 = require("../../lib/");
const defaultOptions = (yargs) => {
    return yargs.option('source', {
        default: '.',
        describe: ''
    });
};
let options = (yargs) => defaultOptions(yargs);
const toHTML = (file) => {
    return `<div class="thumb">
        <img src="${file}" width="33%" style="float:left" />
        </div
    `;
};
// node ./build/main.js md:thumbs --debug=true --source=../../howto/controlbox/media
exports.register = (cli) => {
    return cli.command('md:thumbs', 'Create a thumbnail grid from the current directory ', options, (argv) => __awaiter(void 0, void 0, void 0, function* () {
        if (argv.help) {
            return;
        }
        const isDebug = argv.debug === 'true';
        // const config = read(argv.products ? path.resolve(`${argv.products}/bazar/config.json`) : path.resolve('./config.json'), 'json') as any;
        const source_path = path.resolve(`${argv.source}`);
        const target_path = `${source_path}/thumbs.md`;
        // const bazar_fragments_path = path.resolve(`${config.fragments_path}`);
        isDebug && debug.info(`\n Generate thumbs ${source_path}`);
        if (!lib_1.exists(source_path)) {
            debug.error(`\t Cant find at ${source_path}, path doesn't exists`);
            return;
        }
        // read all vendor specific fragments
        let pictures = lib_1.files(source_path, '*.+(JPG|jpg)');
        pictures = pictures.map((f) => toHTML(`./${path.parse(f).base}`));
        isDebug && debug.debug("bazar fragments", pictures);
        lib_1.write(target_path, pictures.join("\n"));
        /*
        // compile and write out
        for (const key in fragments) {
            const resolved = utils.substitute(fragments[key], fragments);
            fragments[key] = resolved;
            isDebug && debug.info(`resolve ${key} to ${resolved}`);
        }

        
        const products_description = utils.substitute(fragments.product, fragments);

        if(!exists(path.resolve(`${tar}/bazar/out/`))){
            dir(path.resolve(`${product_path}/bazar/out/`));
            isDebug && debug.info('created bazar/out folder in product!');
        }
        
        let out_path = path.resolve(`${}/bazar/out/product.html`);
        isDebug && debug.info(`Write product description ${out_path}`);
        write(out_path, products_description);
        */
        // isDebug && debug.debug("bazar fragments", fragments);
    }));
};
//# sourceMappingURL=md_thumbs.js.map