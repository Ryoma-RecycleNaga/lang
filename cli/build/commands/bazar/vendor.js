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
exports.register = void 0;
const debug = require("../..");
const utils = require("../../lib/common/strings");
const path = require("path");
const read_1 = require("@xblox/fs/read");
const dir_1 = require("@xblox/fs/dir");
const write_1 = require("@xblox/fs/write");
const showdown_1 = require("showdown");
const fg = require('fast-glob');
const fs_1 = require("fs");
// reads google sheet to convert BOMs to production parts
const defaultOptions = (yargs) => {
    return yargs.option('products', {
        default: './',
        describe: 'location of the products folder which contains the \'bazar\' and \'products\' folders'
    }).option('format', {
        default: 'html',
        describe: 'selects the output format, can be \'html\' or \'md\''
    }).option('debug', {
        default: 'false',
        describe: 'Enable internal debug message'
    });
};
let options = (yargs) => defaultOptions(yargs);
const files = (dir, glob) => fg.sync(glob, { dot: true, cwd: dir, absolute: true });
const readContent = (path, markdown) => {
    const content = read_1.sync(path, 'string');
    if (markdown) {
        let converter = new showdown_1.Converter();
        converter.setOption('literalMidWordUnderscores', 'true');
        return converter.makeHtml(content);
    }
    else {
        return content;
    }
};
// npm run build ; node ./build/main.js bazar-vendor-html --products=../../products
exports.register = (cli) => {
    return cli.command('bazar-vendor-html', 'Creates Bazar vendor HTML description', options, (argv) => __awaiter(void 0, void 0, void 0, function* () {
        if (argv.help) {
            return;
        }
        const format = argv.format || 'html';
        const markdown = format === 'md';
        const isDebug = argv.debug === 'true';
        const bazarPath = path.resolve(`${argv.products}/templates/bazar/`);
        const config = read_1.sync(argv.products ? path.resolve(`${bazarPath}/config.json`) : path.resolve('./config.json'), 'json');
        const bazar_fragments_path = path.resolve(`${config.fragments_path}`);
        let fragments = Object.assign({}, config);
        // read all vendor specific fragments
        let bazar_fragment_files = files(bazar_fragments_path, '*.html');
        bazar_fragment_files.map((f) => fragments[path.parse(f).name] = readContent(f, markdown));
        bazar_fragment_files = files(bazar_fragments_path, '*.md');
        bazar_fragment_files.map((f) => fragments[path.parse(f).name] = readContent(f, true));
        // read all product specific fragments
        // compile and write out
        for (const key in fragments) {
            const resolved = utils.substitute(fragments[key], fragments);
            fragments[key] = resolved;
            // isDebug && debug.info(`resolve ${key} to ${resolved}`);
            isDebug && debug.info(`resolve ${key}`);
        }
        const products_description = utils.substitute(fragments.vendor, fragments);
        if (!fs_1.existsSync(path.resolve(`${bazarPath}/out/`))) {
            dir_1.sync(path.resolve(`${bazarPath}/out/`));
            isDebug && debug.info('created bazar/out folder!');
        }
        const out_path = path.resolve(`${bazarPath}/out/vendor.html`);
        // isDebug && debug.info(`Write vendor description ${out_path} ${fragments.product}`);
        write_1.sync(out_path, products_description);
        // isDebug && debug.debug("bazar fragments", fragments);
    }));
};
//# sourceMappingURL=vendor.js.map