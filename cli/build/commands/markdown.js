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
const defaultData = (override) => {
    return Object.assign({ PART_PARENT: 'my parent 2', PART_INVENTORY: '', PART_NAME: 'Front Shield', PART_VERSION: 1, PART_VERSIONS: '1 2', PART_ID: 'Z_4_FRONT_SHIELD', PART_DRAWING: 'https://a360.co/37pDdVD', PART_PREVIEW: '', PART_COMPAT: '', PART_CAPS: '', PART_ASSEMBLY: '', PART_TOOLS: '', PART_TEMPLATES: '', PART_STOCK: '', PART_MACHINES: '', PART_STEPS: '', PART_EDIT: '' }, override);
};
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
    input = utils.replace(input, null, defaultData(data), {
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
// npm run build ; node ./build/main.js markdown --input=../pages --output=../out
exports.register = (cli) => {
    return cli.command('markdown', 'Converts md files to html using showdown', options, (argv) => __awaiter(void 0, void 0, void 0, function* () {
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
//# sourceMappingURL=markdown.js.map