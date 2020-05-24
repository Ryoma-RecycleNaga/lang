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
const debug = require("../..");
const strings_1 = require("../../lib/common/strings");
const path = require("path");
const slash = require('slash');
const lib_1 = require("../../lib/");
const defaultOptions = (yargs) => {
    return yargs.option('source', {
        default: '.',
        describe: ''
    }).option('resize', {
        default: 'false',
        describe: 'resize images'
    }).option('outfile', {
        default: 'thumb.md',
        describe: 'the name of the output file'
    }).option('root', {
        default: '.',
        describe: ''
    });
};
let options = (yargs) => defaultOptions(yargs);
// node ./build/main.js md:thumbs --debug=true --source=../../products/howto/controlbox/media
exports.register = (cli) => {
    return cli.command('md:thumbs', 'Create a thumbnail grid from the current directory ', options, (argv) => __awaiter(void 0, void 0, void 0, function* () {
        if (argv.help) {
            return;
        }
        const isDebug = argv.debug === 'true';
        const resize = argv.resize === 'true';
        const source_path = path.resolve(argv.source);
        const root_path = path.resolve(argv.root);
        const target_path = `${source_path}/${argv.outfile}`;
        const _images = lib_1.images(source_path);
        isDebug && debug.info(`\n Generate thumbs from ${source_path} to ${target_path}`);
        if (!lib_1.exists(source_path)) {
            debug.error(`\t Cant find at ${source_path}, path doesn't exists`);
            return;
        }
        resize && (yield lib_1.resize_images(_images));
        let content;
        if (lib_1.exists(path.resolve(`${source_path}/Readme.md`))) {
            content = lib_1.toHTML(path.resolve(`${source_path}/Readme.md`), true);
        }
        else {
            content = lib_1.thumbs(source_path, true);
        }
        let title = path.parse(source_path).base.toLowerCase().replace('-', ' ').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        let rel = path.relative(root_path, source_path);
        const image = '/pp/' + slash(rel) + '/' + path.parse(lib_1.tail_image(_images)).base;
        const config = lib_1.read(path.resolve(`${source_path}/config.json`), 'json') || {};
        let config_yaml = lib_1.read(path.resolve(`${source_path}/config.yaml`), 'string') || "";
        let header = lib_1.read(path.resolve(`${root_path}/templates/jekyll/howto.header.md`), 'string') || "";
        let footer = lib_1.read(path.resolve(`${root_path}/templates/jekyll/howto.footer.md`), 'string') || "";
        header = strings_1.substitute(header, config);
        footer = strings_1.substitute(footer, config);
        const fmHead = lib_1.howto_header(config.title || title, config.category || "", config.image || image, config.description || "", config.tagline || "", config_yaml);
        content = fmHead + '\n\n' + header + content + footer;
        // debug.info('test' , path.resolve(`${root_path}/_howto/how-to-${path.parse(source_path).name}.md`));
        lib_1.write(target_path, content);
        // write(path.resolve(`${root_path}/_howto/how-to-${path.parse(source_path).name}.md`), content);
    }));
};
//# sourceMappingURL=md_thumbs.js.map