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
const argv_1 = require("../argv");
const __1 = require("..");
const path = require("path");
const exists_1 = require("@xblox/fs/exists");
const dir_1 = require("@xblox/fs/dir");
const index_1 = require("../lib/process/index");
const fg = require('fast-glob');
const bluebird = require("bluebird");
// no extra options, using defaults
const options = (yargs) => argv_1.defaultOptions(yargs);
const convert = (file, dst) => {
    const cprocess = new index_1.Process({
        bin: 'magick'
    });
    console.log(path.parse(file));
    const inParts = path.parse(file);
    // magick convert leg.pdf -quality 100 -density 250 -trim -flatten -resize 200% -sharpen 0x1.0 leg.jpg
    const target = path.resolve(dst + '/' + inParts.name + '.jpg');
    const p = cprocess.exec('convert', {}, [
        path.resolve(file),
        '-quality 100',
        '-density 250',
        '-trim',
        '-flatten',
        '-resize 200%',
        '-sharpen 0x1.0',
        target
    ]);
};
const convertFiles = (files, dst) => {
    return bluebird.mapSeries(files, (file) => {
        const inParts = path.parse(file);
        // magick convert leg.pdf -quality 100 -density 250 -trim -flatten -resize 200% -sharpen 0x1.0 leg.jpg
        const promise = index_1.Helper.run(inParts.dir, 'convert', [
            inParts.base,
            '-quality 100',
            '-density 250',
            '-trim',
            '-flatten',
            '-resize 200%',
            '-sharpen 0x1.0',
            inParts.name + '.jpg'
        ]);
        return promise;
    });
};
// npm run build ; node ./build/main.js pdf2jpg --input=../drawings --output=../drawings
exports.register = (cli) => {
    return cli.command('pdf2jpg', '', options, (argv) => __awaiter(void 0, void 0, void 0, function* () {
        if (argv.help) {
            return;
        }
        const src = path.resolve('' + argv.input);
        const dst = path.resolve('' + argv.output);
        if (!exists_1.sync(dst)) {
            dir_1.sync(dst);
        }
        const files = fg.sync('*.pdf', { dot: true, cwd: src, absolute: true });
        convertFiles(files, dst);
        if (argv.debug) {
            __1.debug(`Converted ${files.length} files`);
        }
    }));
};
//# sourceMappingURL=pdf2jpg.js.map