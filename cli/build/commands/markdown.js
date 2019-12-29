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
const read_1 = require("@xblox/fs/read");
const showdown_1 = require("showdown");
const fg = require('fast-glob');
const defaultOptions2 = (yargs) => {
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
let options = (yargs) => defaultOptions2(yargs);
const convert = (input) => {
    let converter = new showdown_1.Converter();
    converter.setOption('literalMidWordUnderscores', 'true');
    return converter.makeHtml(input);
};
exports.register = (cli) => {
    return cli.command('markdown', 'Converts md files to html using showdown', options, (argv) => __awaiter(void 0, void 0, void 0, function* () {
        const src = path.resolve('' + argv.input);
        const dst = path.resolve('' + argv.output);
        console.log('find in ' + src);
        const files = fg.sync('*.md', { dot: true, cwd: src, absolute: true });
        console.log('files ', files);
        files.forEach((f) => {
            const content = read_1.sync(f, 'string');
            const html = convert(content);
            console.log(` File : ${f} = \n   ${content} =\n ${html}`);
        });
        if (argv.help) {
            return;
        }
        // const args = sanitize(argv) as Options;
        // output({}, args);
    }));
};
//# sourceMappingURL=markdown.js.map