import * as CLI from 'yargs';
import * as path from 'path';
import { existsSync } from 'fs';
const sanitize = require("sanitize-filename");
const defaultOptions = (yargs: CLI.Argv) => {
    return yargs.option('input', {
        default: './',
        describe: 'The sources'
    });
};

let options = (yargs: CLI.Argv) => defaultOptions(yargs);

// npm run build ; node ./build/main.js sanitize-filenames --input=.
export const register = (cli: CLI.Argv) => {
    return cli.command('sanitize-filename', 'Removes invalid chars in filenames', options, async (argv: CLI.Arguments) => {
        if (argv.help) { return; }
        const src = path.resolve('' + argv.input);
        if(existsSync(src)){
            sanitize(src);
        }
    });
};
