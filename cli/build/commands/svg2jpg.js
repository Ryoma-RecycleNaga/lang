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
const __1 = require("..");
const path = require("path");
const index_1 = require("../lib/process/index");
const bluebird = require("bluebird");
const fg = require('fast-glob');
const defaultOptions = (yargs) => {
    return yargs.option('input', {
        default: './',
        describe: 'The sources'
    }).option('debug', {
        default: 'false',
        describe: 'Enable internal debug message'
    });
};
let options = (yargs) => defaultOptions(yargs);
function convertFiles(files) {
    return __awaiter(this, void 0, void 0, function* () {
        return bluebird.mapSeries(files, (file) => {
            const inParts = path.parse(file);
            const promise = index_1.Helper.run(inParts.dir, 'convert', [
                `"${inParts.base}"`,
                '-quality 40',
                '-sharpen 0x1.0',
                `"${inParts.name}.jpg"`
            ]);
            return promise;
        });
    });
}
//node ./build/main.js svg2jpg --input=../tests/svg/
exports.register = (cli) => {
    return cli.command('svg2jpg', '', options, (argv) => __awaiter(void 0, void 0, void 0, function* () {
        if (argv.help) {
            return;
        }
        const src = path.resolve('' + argv.input);
        const files = fg.sync('*.svg|*.SVG', { dot: true, cwd: src, absolute: true });
        if (argv.debug) {
            __1.debug(`Begin convert SVG files at ${src} ${files}`);
        }
        yield convertFiles(files);
        if (argv.debug) {
            __1.debug(`Converted ${files.length} files`);
        }
    }));
};
//# sourceMappingURL=svg2jpg.js.map