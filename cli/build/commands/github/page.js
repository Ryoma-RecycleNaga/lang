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
const utils = require("../../lib/common/strings");
const path = require("path");
const lib_1 = require("../../lib");
const util_1 = require("util");
const md_tables = require('markdown-table');
const defaultOptions = (yargs) => {
    return yargs.option('src', {
        default: '',
        describe: 'the source path to the page'
    }).option('dst', {
        default: '',
        describe: 'output path'
    })
        .option('template', {
        default: '',
        describe: 'the template for the page'
    })
        .option('templates', {
        default: './',
        describe: 'location of the jekyll templates folder'
    }).option('format', {
        default: 'html',
        describe: 'selects the output format, can be \'html\' or \'md\''
    }).option('debug', {
        default: 'true',
        describe: 'Enable internal debug message'
    });
};
let options = (yargs) => defaultOptions(yargs);
// node ./build/main.js jekyll-page --debug=true --templates=../../products/templates/jekyll --src=../../products/_pages/guide_motor.md --dst=../../products/_pages/motors-out.md
exports.register = (cli) => {
    return cli.command('jekyll-page', 'Creates Jekyll markdown page', options, (argv) => __awaiter(void 0, void 0, void 0, function* () {
        if (argv.help) {
            return;
        }
        const markdown = true;
        const isDebug = argv.debug === 'true';
        // global config
        const cPath = argv.templates ? path.resolve(`${argv.templates}/config.json`) : path.resolve('./config.json');
        isDebug && debug.info(`read config at ${cPath}`);
        const config = lib_1.read(cPath, 'json') || {};
        const src_path = path.resolve(`${argv.src}`);
        let parsed = path.parse(src_path);
        const dst_path = path.resolve(`${argv.dst}`);
        const templates_path = path.resolve(`${argv.templates}`);
        isDebug && debug.info(`\n Generate page for ${src_path},
            using templates at ${templates_path}`);
        if (!lib_1.exists(src_path)) {
            debug.error(`\t Cant find page at ${src_path}, path doesn't exists`);
            return;
        }
        let fragments = Object.assign({}, config);
        let page_config = lib_1.read(path.resolve(`${parsed.dir}/${parsed.name}.json`), 'json') || {};
        if (Object.keys(page_config)) {
            for (const key in page_config) {
                let val = page_config[key];
                if (util_1.isArray(val)) {
                    page_config[key] = md_tables(val);
                }
                else if (util_1.isString(val)) {
                    if (val.endsWith('.csv')) {
                        let csv = path.resolve(`${parsed.dir}/${val}`);
                        if (lib_1.exists(csv)) {
                            csv = lib_1.read(csv) || "";
                            try {
                                csv = lib_1.csvToMarkdown(csv);
                                page_config[key] = csv;
                            }
                            catch (e) {
                                debug.error(`Error converting csv to md ${val}`);
                            }
                        }
                    }
                }
            }
            fragments = Object.assign(Object.assign({}, fragments), page_config);
        }
        // read all global fragments
        isDebug && debug.info(`Read global fragments at ${templates_path}`);
        let tepmplate_files = lib_1.files(templates_path, '*.html');
        tepmplate_files.map((f) => fragments[path.parse(f).name] = lib_1.toHTML(f, markdown));
        tepmplate_files = lib_1.files(templates_path, '*.md');
        tepmplate_files.map((f) => fragments[path.parse(f).name] = lib_1.toHTML(f, markdown));
        // compile and write out
        for (const key in fragments) {
            const resolved = utils.substitute(fragments[key], fragments);
            fragments[key] = resolved;
        }
        for (const key in fragments) {
            const resolved = utils.substitute(fragments[key], fragments);
            fragments[key] = resolved;
        }
        let src = lib_1.read(path.resolve(`${src_path}`), 'string') || "";
        let page_yaml = lib_1.read(path.resolve(`${parsed.dir}/${parsed.name}.yaml`), 'string') || "";
        page_yaml = utils.substitute(page_yaml, fragments);
        const content = utils.substitute(src, fragments);
        isDebug && debug.info(`Write jekyll machine page ${dst_path}`);
        lib_1.write(dst_path, content);
    }));
};
//# sourceMappingURL=page.js.map