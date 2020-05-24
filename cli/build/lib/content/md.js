"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("../..");
const path = require("path");
const lib_1 = require("../../lib");
const util_1 = require("util");
const md_tables = require('markdown-table');
exports.parse_config = (config, root) => {
    if (Object.keys(config)) {
        for (const key in config) {
            let val = config[key];
            if (util_1.isArray(val)) {
                config[key] = md_tables(val);
            }
            else if (util_1.isString(val)) {
                if (val.endsWith('.csv')) {
                    const parsed = path.parse(root);
                    let csv = path.resolve(`${parsed.dir}/${val}`);
                    if (lib_1.exists(csv)) {
                        csv = lib_1.read(csv) || "";
                        try {
                            csv = lib_1.csvToMarkdown(csv);
                            config[key] = csv;
                        }
                        catch (e) {
                            debug.error(`Error converting csv to md ${val}`);
                        }
                    }
                }
            }
        }
    }
};
//# sourceMappingURL=md.js.map