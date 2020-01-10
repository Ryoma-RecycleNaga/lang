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
const __1 = require("..");
const utils = require("../lib/common/strings");
const path = require("path");
const read_1 = require("@xblox/fs/read");
const exists_1 = require("@xblox/fs/exists");
const dir_1 = require("@xblox/fs/dir");
const write_1 = require("@xblox/fs/write");
const showdown_1 = require("showdown");
const fg = require('fast-glob');
/***
 * todos - pipe :
 * 1. collect & remove docusaurus meta
 * 2. remove|replace icons, styles, non - printables
 * 3. replace html with md
 * 4. replace tables with g-sheets
 * 5. replace headings
 * 6. Stencil template
 * 6.1 insert override breakers for addon content
 * 6.2 wrap sections into tabs
 * 6.3. wrap text for translation
 * 8. lint & format
 * 9. store back as raw md
 */
const defaultOptions = (yargs) => {
    return yargs.option('input', {
        default: './',
        describe: 'The sources'
    }).option('output', {
        default: './',
        describe: 'The output'
    }).option('debug', {
        default: 'false',
        describe: 'Enable internal debug message'
    });
};
let options = (yargs) => defaultOptions(yargs);
exports.convert = (input, data) => {
    input = utils.replace(input, null, (data), {
        begin: '<%',
        end: '%>'
    });
    let converter = new showdown_1.Converter();
    converter.setOption('literalMidWordUnderscores', 'true');
    return converter.makeHtml(input);
};
exports.convertFiles = (files, dst) => {
    files.forEach((f) => {
        const content = read_1.sync(f, 'string');
        const html = exports.convert(content, {});
        if (!dst) {
            dst = path.parse(f).dir;
        }
        const target = dst + path.sep + path.parse(f).name + '.html';
        __1.debug(`\t Convert ${f} to ${target}`);
        write_1.sync(target, html);
    });
};
// npm run build ; node ./build/main.js academy --input=../../academy/docs --output=../../academy-raw
exports.register = (cli) => {
    return cli.command('academy', '1st pass of converting academy md files into stencil fragments', options, (argv) => __awaiter(void 0, void 0, void 0, function* () {
        if (argv.help) {
            return;
        }
        const src = path.resolve('' + argv.input);
        const dst = path.resolve('' + argv.output);
        if (!exists_1.sync(dst)) {
            dir_1.sync(dst);
        }
        const files = fg.sync('*.md', { dot: true, cwd: src, absolute: true });
        exports.convertFiles(files, dst);
        if (argv.debug) {
            __1.debug(`Converted ${files.length} files`);
        }
    }));
};
//# sourceMappingURL=academy.js.map