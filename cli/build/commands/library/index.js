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
const path = require("path");
const lib_1 = require("../../lib/");
const defaultOptions = (yargs) => {
    return yargs.option('src', {
        default: '../../pp-v4',
        describe: 'location of the pp-v4 folder'
    })
        .option('debug', {
        default: 'true',
        describe: 'Enable internal debug message'
    });
};
let options = (yargs) => defaultOptions(yargs);
// npm run build ; node ./build/main.js library --debug=true
exports.register = (cli) => {
    return cli.command('library', 'Creates the Precious Plastic Library', options, (argv) => __awaiter(void 0, void 0, void 0, function* () {
        if (argv.help) {
            return;
        }
        const format = 'md';
        const isDebug = argv.debug === 'true';
        const config = lib_1.read(argv.src ? path.resolve(`${argv.src}/config.json`) : path.resolve('./config.json'), 'json');
        const bazar_fragments_path = path.resolve(`${argv.src}/library/fragments`);
        /*

        let fragments: any = { ...config };

        // read all vendor specific fragments
        let bazar_fragment_files = files(bazar_fragments_path, '*.html');
        bazar_fragment_files.map((f) => fragments[path.parse(f).name] = toHTML(f, false));

        bazar_fragment_files = files(bazar_fragments_path, '*.md');
        bazar_fragment_files.map((f) => fragments[path.parse(f).name] = toHTML(f, false));

        // compile and write out

        for (const key in fragments) {
            const resolved = utils.substitute(fragments[key], fragments);
            fragments[key] = resolved;
            isDebug && debug.info(`resolve ${key} to ${resolved}`);
        }

        const products_description = utils.substitute(fragments.product, fragments);

        if (!exists(path.resolve(`${product_path}/bazar/out/`))) {
            dir(path.resolve(`${product_path}/bazar/out/`));
            isDebug && debug.info('created bazar/out folder in product!');
        }

        let out_path = path.resolve(`${product_path}/bazar/out/product.html`);
        isDebug && debug.info(`Write product description ${out_path}`);
        write(out_path, products_description);
        // isDebug && debug.debug("bazar fragments", fragments);
        */
    }));
};
//# sourceMappingURL=index.js.map