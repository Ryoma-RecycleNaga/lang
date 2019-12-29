#!/usr/bin/env node
import { defaults } from './_cli'; defaults();

import * as cli from 'yargs';
const yargonaut = require('yargonaut').style('blue').helpStyle('green');

import { info } from './log';
import { defaultOptions, sanitize } from './argv';

//import { register as registerSummary } from './commands/summary'; registerSummary(cli);
//import { register as registerDetail } from './commands/detail'; registerDetail(cli);
//import { register as registerClean } from './commands/clean'; registerClean(cli);
import { register as registerMarkdown } from './commands/markdown'; registerMarkdown(cli);
import { register as registerPDF2JPG } from './commands/pdf2jpg'; registerPDF2JPG(cli);

const argv = cli.argv;

if (argv.h || argv.help) {
    cli.showHelp();
    process.exit();
} else if (argv.v || argv.version) {
    // tslint:disable-next-line:no-var-requires
    const pkginfo = require('../package.json');
    process.exit();
}
