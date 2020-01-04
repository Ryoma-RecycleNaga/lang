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
const chokidar = require("chokidar");
const path = require("path");
const __1 = require("..");
const markdown_1 = require("./markdown");
const utils = require("../lib/common/strings");
const read_1 = require("@xblox/fs/read");
const write_1 = require("@xblox/fs/write");
const cheerio = require("cheerio");
const pretty = require('pretty');
const defaultOptions = (yargs) => {
    return yargs.option('input', {
        default: './',
        describe: 'The sources'
    }).option('debug', {
        default: 'false',
        describe: 'Enable internal debug message'
    }).option('tsx', {
        default: 'true',
        describe: 'Update tsx file'
    });
};
exports.parseHTML = (input) => {
    const $ = cheerio.load(input, {
        xmlMode: true
    });
    $('meta').remove();
    $('templates').remove();
    input = $.html();
    input = pretty(input, { ocd: true });
    return input;
};
exports.updateTSX = (mdPath) => {
    const parts = path.parse(mdPath);
    let html = read_1.sync(`${parts.dir}/${parts.name}.html`, 'string');
    const tsxin = read_1.sync(`${parts.dir}/${parts.name}.tsxin`, 'string');
    html = exports.parseHTML(html);
    const output = utils.replace(tsxin, null, {
        CONTENT: html
    }, {
        begin: '<%',
        end: '%>'
    });
    write_1.sync(`${parts.dir}/${parts.name}.tsx`, output);
};
let options = (yargs) => defaultOptions(yargs);
// npm run build ; node ./build/main.js watch --input=../pages
exports.register = (cli) => {
    return cli.command('watch', '', options, (argv) => __awaiter(void 0, void 0, void 0, function* () {
        if (argv.help) {
            return;
        }
        const src = path.resolve('' + argv.input);
        const watcher = chokidar.watch(`${src}/**/*.md`, {
            ignored: /(^|[\/\\])\../,
            persistent: true
        });
        if (argv.debug) {
            __1.debug(`Watching ${src}`);
        }
        watcher
            .on('change', path => {
            markdown_1.convertFiles([path]);
            exports.updateTSX(path);
        });
    }));
};
//# sourceMappingURL=watch.js.map