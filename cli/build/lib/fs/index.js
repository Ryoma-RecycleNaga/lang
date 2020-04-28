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
const fg = require('fast-glob');
const path = require("path");
const bluebird = require("bluebird");
const showdown_1 = require("showdown");
const read_1 = require("@xblox/fs/read");
const exists_1 = require("@xblox/fs/exists");
const js_beautify_1 = require("js-beautify");
var read_2 = require("@xblox/fs/read");
exports.read = read_2.sync;
var exists_2 = require("@xblox/fs/exists");
exports.exists = exists_2.sync;
var dir_1 = require("@xblox/fs/dir");
exports.dir = dir_1.sync;
var write_1 = require("@xblox/fs/write");
exports.write = write_1.sync;
const index_1 = require("../process/index");
const array_1 = require("../common/array");
const html_1 = require("../content/html");
const IMAGES_GLOB = '*.+(JPG|jpg|png|PNG|gif)';
exports.files = (dir, glob) => fg.sync(glob, { dot: true, cwd: dir, absolute: true });
exports.images = (source) => exports.files(source, IMAGES_GLOB);
exports.head_image = (_images) => array_1.firstOf(_images);
exports.tail_image = (_images) => array_1.lastOf(_images);
function resize_images(files) {
    return __awaiter(this, void 0, void 0, function* () {
        return bluebird.mapSeries(files, (file) => {
            const inParts = path.parse(file);
            const promise = index_1.Helper.run(inParts.dir, 'convert', [
                `"${inParts.base}"`,
                '-quality 70',
                '-resize 1980',
                '-sharpen 0x1.0',
                `"${inParts.name}${inParts.ext}"`
            ]);
            return promise;
        });
    });
}
exports.resize_images = resize_images;
exports.toHTML = (path, markdown) => {
    const content = read_1.sync(path, 'string');
    if (!markdown) {
        let converter = new showdown_1.Converter({ tables: true });
        converter.setOption('literalMidWordUnderscores', 'true');
        return converter.makeHtml(content);
    }
    else {
        return content;
    }
};
exports.thumbs = (source, meta = true, sep = "<hr/>") => {
    let pictures = exports.images(source);
    let content = "";
    pictures.forEach((f) => {
        if (meta) {
            let picMD = path.resolve(path.join(path.parse(f).dir, path.sep, path.parse(f).name + '.md'));
            if (exists_1.sync(picMD)) {
                content += exports.toHTML(picMD, true);
                content += "\n";
            }
        }
        content += html_1.img(`./${path.parse(f).base}`);
        content += "\n";
        content += sep;
    });
    return js_beautify_1.html_beautify(content);
};
//# sourceMappingURL=index.js.map