#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _cli_1 = require("./_cli");
_cli_1.defaults();
const cli = require("yargs");
const yargonaut = require('yargonaut').style('blue').helpStyle('green');
//import { register as registerSummary } from './commands/summary'; registerSummary(cli);
//import { register as registerDetail } from './commands/detail'; registerDetail(cli);
//import { register as registerClean } from './commands/clean'; registerClean(cli);
const markdown_1 = require("./commands/markdown");
markdown_1.register(cli);
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