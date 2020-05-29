#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _cli_1 = require("./_cli");
_cli_1.defaults();
const cli = require("yargs");
const markdown_1 = require("./commands/markdown");
markdown_1.register(cli);
const pdf2jpg_1 = require("./commands/pdf2jpg");
pdf2jpg_1.register(cli);
const watch_1 = require("./commands/watch");
watch_1.register(cli);
const academy_1 = require("./commands/academy");
academy_1.register(cli);
const onearmy_1 = require("./commands/onearmy");
onearmy_1.register(cli);
const tests_1 = require("./commands/tests");
tests_1.register(cli);
const bom_1 = require("./commands/v4/bom");
bom_1.register(cli);
const product_1 = require("./commands/bazar/product");
product_1.register(cli);
const vendor_1 = require("./commands/bazar/vendor");
vendor_1.register(cli);
const library_1 = require("./commands/library");
library_1.register(cli);
const sanitize_filename_1 = require("./commands/common/sanitize-filename");
sanitize_filename_1.register(cli);
const product_index_1 = require("./commands/github/product_index");
product_index_1.register(cli);
const md_thumbs_1 = require("./commands/github/md_thumbs");
md_thumbs_1.register(cli);
const page_1 = require("./commands/github/page");
page_1.register(cli);
const argv = cli.argv;
if (argv.h || argv.help) {
    cli.showHelp();
    process.exit();
}
else if (argv.v || argv.version) {
    // tslint:disable-next-line:no-var-requires
    const pkginfo = require('../package.json');
    process.exit();
}
//# sourceMappingURL=main.js.map