"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("../..");
const path = require("path");
const util_1 = require("util");
const lib_1 = require("../../lib/");
const js_beautify_1 = require("js-beautify");
const md_tables = require('markdown-table');
exports.parse_config = (config, root) => {
    if (Object.keys(config)) {
        for (const key in config) {
            let val = config[key];
            if (util_1.isArray(val)) {
                config[key] = lib_1.md2html(md_tables(val));
            }
            else if (util_1.isString(val)) {
                if (val.endsWith('.csv')) {
                    debug.info("parsing CSV " + val);
                    const parsed = path.parse(root);
                    let csv = path.resolve(`${parsed.dir}/${parsed.base}/${val}`);
                    if (lib_1.exists(csv)) {
                        csv = lib_1.read(csv) || "";
                        try {
                            csv = lib_1.md2html(lib_1.csvToMarkdown(csv));
                            config[key] = csv;
                        }
                        catch (e) {
                            debug.error(`Error converting csv to md ${val}`);
                        }
                    }
                    else {
                        debug.error(`Can't find CSV file at ${csv}`, parsed);
                    }
                }
            }
        }
    }
};
exports.md_edit_wrap = (content, f, prefix = '', context = '') => {
    return js_beautify_1.html_beautify(`<div prefix="${prefix}" file="${path.parse(f).base}" context="${context}" class="fragment">${content}</div>`);
};
exports.read_fragments = (src, config, prefix = '', context = '') => {
    let fragments = lib_1.files(src, '*.html');
    fragments.map((f) => {
        config[path.parse(f).name] = exports.md_edit_wrap(lib_1.toHTML(f, true), f, prefix, context);
    });
    fragments = lib_1.files(src, '*.md');
    fragments.map((f) => {
        config[path.parse(f).name] = exports.md_edit_wrap(lib_1.toHTML(f, false), f, prefix, context);
    });
    return config;
};
//# sourceMappingURL=md.js.map