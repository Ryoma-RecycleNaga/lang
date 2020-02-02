import * as CLI from 'yargs';
import * as debug from '../..';
import * as utils from '../../lib/common/strings';
import * as path from 'path';
import { files, dir, read, write, toHTML, exists } from '../../lib/';

const defaultOptions = (yargs: CLI.Argv) => {
    return yargs.option('src', {
        default: '../../pp-v4',
        describe: 'location of the pp-v4 folder'
    })
        .option('debug', {
            default: 'true',
            describe: 'Enable internal debug message'
        })
};

let options = (yargs: CLI.Argv) => defaultOptions(yargs);

// npm run build ; node ./build/main.js library --debug=true
export const register = (cli: CLI.Argv) => {
    return cli.command('library', 'Creates the Precious Plastic Library', options, async (argv: CLI.Arguments) => {
        if (argv.help) { return; }

        const format = 'md';

        const isDebug = argv.debug === 'true';

        const config = read(argv.src ? path.resolve(`${argv.src}/config.json`) : path.resolve('./config.json'), 'json') as any;

        const bazar_fragments_path = path.resolve(`${argv.src}/library/fragments`);

        /*

        let fragments: any = { ...config };

        // read all vendor specific fragments
        let bazar_fragment_files = files(bazar_fragments_path, '*.html');
        bazar_fragment_files.map((f) => fragments[path.parse(f).name] = toHTML(f, false));

        bazar_fragment_files = files(bazar_fragments_path, '*.md');
        bazar_fragment_files.map((f) => fragments[path.parse(f).name] = toHTML(f, false));

        // compile and write out

        for (const key in fragments) {
            const resolved = utils.substitute(fragments[key], fragments);
            fragments[key] = resolved;
            isDebug && debug.info(`resolve ${key} to ${resolved}`);
        }

        const products_description = utils.substitute(fragments.product, fragments);

        if (!exists(path.resolve(`${product_path}/bazar/out/`))) {
            dir(path.resolve(`${product_path}/bazar/out/`));
            isDebug && debug.info('created bazar/out folder in product!');
        }

        let out_path = path.resolve(`${product_path}/bazar/out/product.html`);
        isDebug && debug.info(`Write product description ${out_path}`);
        write(out_path, products_description);
        // isDebug && debug.debug("bazar fragments", fragments);
        */
    });
};
