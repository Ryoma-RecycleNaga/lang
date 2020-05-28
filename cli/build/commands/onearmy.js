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
const crawler_1 = require("../lib/net/crawler");
const path = require("path");
const exists_1 = require("@xblox/fs/exists");
const dir_1 = require("@xblox/fs/dir");
const remove_1 = require("@xblox/fs/remove");
const fg = require('fast-glob');
/***
 * todos - pipe :
 * 1. custom puppeteer scraper
 * 2. remove|replace icons, styles, non - printables
 * 4. how-to - parser -> md
 * 5. indexer by tags
 * 8. lint & format
 * 9. store back as raw md [how-to]/[step 1...n].md
 * 10. store github repo with raw md files
 *
 */
const defaultOptions = (yargs) => {
    return yargs.option('output', {
        default: './',
        describe: 'The output directory'
    }).option('debug', {
        default: 'false',
        describe: 'Enable internal debug message'
    });
};
let options = (yargs) => defaultOptions(yargs);
// npm run build ; node ./build/main.js onearmy --output=../../onearmy-raw
exports.register = (cli) => {
    return cli.command('onearmy', '1st pass of converting onearmy docs stencil fragments', options, (argv) => __awaiter(void 0, void 0, void 0, function* () {
        process.env['APIFY_LOCAL_STORAGE_DIR'] = '.';
        remove_1.sync(path.resolve('./request_queues'));
        if (argv.help) {
            return;
        }
        const dst = path.resolve('' + argv.output || './');
        if (!exists_1.sync(dst)) {
            dir_1.sync(dst);
        }
        yield crawler_1.crawler();
        if (argv.debug) {
        }
    }));
};
//# sourceMappingURL=onearmy.js.map