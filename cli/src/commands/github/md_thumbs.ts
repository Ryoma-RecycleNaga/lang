import * as CLI from 'yargs';
import * as debug from '../..';
import * as utils from '../../lib/common/strings';
import * as path from 'path';
import { files, dir, read, write, toHTML, exists } from '../../lib/';

const defaultOptions = (yargs: CLI.Argv) => {
    return yargs.option('source', {
        default: '.',
        describe: ''
    })
};

let options = (yargs: CLI.Argv) => defaultOptions(yargs);

const img = (file) => {
    return `<div class="thumb">
        <img src="${file}" width="100%" />
        </div>
    `;
}

// node ./build/main.js md:thumbs --debug=true --source=../../howto/controlbox/media
export const register = (cli: CLI.Argv) => {

    return cli.command('md:thumbs', 'Create a thumbnail grid from the current directory ', options, async (argv: CLI.Arguments) => {

        if (argv.help) { return; }

        const isDebug = argv.debug === 'true';

        // const config = read(argv.products ? path.resolve(`${argv.products}/bazar/config.json`) : path.resolve('./config.json'), 'json') as any;

        const source_path = path.resolve(argv.source as any);
        const target_path = `${source_path}/thumbs.md`;

        // const bazar_fragments_path = path.resolve(`${config.fragments_path}`);

        isDebug && debug.info(`\n Generate thumbs ${source_path}`);

        if (!exists(source_path)) {
            debug.error(`\t Cant find at ${source_path}, path doesn't exists`);
            return;
        }

        // read all vendor specific fragments
        let pictures = files(source_path, '*.+(JPG|jpg|png|PNG)') as any[];
        //pictures = pictures.map((f) => toHTML(`./${path.parse(f).base}`));

        isDebug && debug.debug("bazar fragments", pictures);

        let content = "";

        pictures.forEach((f) => {
            let picMD = path.resolve(`${path.parse(f).dir}${path.sep}${path.parse(f).name}.md`);
            if (exists(picMD)) {
                content += toHTML(picMD, true);
                content +="\n";
            }
            content += img(`./${path.parse(f).base}`);
            content +="<hr/>";
        });

        write(target_path, content);

        /*
        // compile and write out
        for (const key in fragments) {
            const resolved = utils.substitute(fragments[key], fragments);
            fragments[key] = resolved;
            isDebug && debug.info(`resolve ${key} to ${resolved}`);
        }

        
        const products_description = utils.substitute(fragments.product, fragments);

        if(!exists(path.resolve(`${tar}/bazar/out/`))){
            dir(path.resolve(`${product_path}/bazar/out/`));
            isDebug && debug.info('created bazar/out folder in product!');
        }
        
        let out_path = path.resolve(`${}/bazar/out/product.html`);
        isDebug && debug.info(`Write product description ${out_path}`);
        write(out_path, products_description);
        */
        // isDebug && debug.debug("bazar fragments", fragments);
    });
};
