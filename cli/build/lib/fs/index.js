"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fg = require('fast-glob');
const showdown_1 = require("showdown");
const read_1 = require("@xblox/fs/read");
exports.files = (dir, glob) => fg.sync(glob, { dot: true, cwd: dir, absolute: true });
var read_2 = require("@xblox/fs/read");
exports.read = read_2.sync;
var exists_1 = require("@xblox/fs/exists");
exports.exists = exists_1.sync;
var dir_1 = require("@xblox/fs/dir");
exports.dir = dir_1.sync;
var write_1 = require("@xblox/fs/write");
exports.write = write_1.sync;
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
//# sourceMappingURL=index.js.map