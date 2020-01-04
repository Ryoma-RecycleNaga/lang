#!/usr/bin/env node
import { defaults } from './_cli'; defaults();

import * as cli from 'yargs';import { register as registerMarkdown } from './commands/markdown'; registerMarkdown(cli);
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
