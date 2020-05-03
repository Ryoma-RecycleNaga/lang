import * as CLI from 'yargs';
import * as debug from '../..';
import { capitalize } from '../../lib/common/strings';
import * as path from 'path';
const slash = require('slash');

import { write, exists, read, thumbs, images, resize_images, tail_image, howto_header, toHTML } from '../../lib/';

const defaultOptions = (yargs: CLI.Argv) => {
    return yargs.option('source', {
        default: '.',
        describe: ''
    }).option('resize', {
        default: 'false',
        describe: 'resize images'
    }).option('outfile', {
        default: 'thumb.md',
        describe: 'the name of the output file'
    }).option('root', {
        default: '.',
        describe: ''
    })
};

let options = (yargs: CLI.Argv) => defaultOptions(yargs);


// node ./build/main.js md:thumbs --debug=true --source=../../products/howto/controlbox/media
export const register = (cli: CLI.Argv) => {

    return cli.command('md:thumbs', 'Create a thumbnail grid from the current directory ', options, async (argv: CLI.Arguments) => {

        if (argv.help) { return; }

        const isDebug = argv.debug === 'true';
        const resize = argv.resize === 'true';

        const source_path = path.resolve(argv.source as any);
        const root_path = path.resolve(argv.root as any);
        const target_path = `${source_path}/${argv.outfile}`;
        const _images = images(source_path);
        isDebug && debug.info(`\n Generate thumbs from ${source_path} to ${target_path}`);

        if (!exists(source_path)) {
            debug.error(`\t Cant find at ${source_path}, path doesn't exists`);
            return;
        }
        resize && await resize_images(_images);
        let content;
        if(exists(path.resolve(`${source_path}/Readme.md`))){
            content = toHTML(path.resolve(`${source_path}/Readme.md`), true);
        }else{
            content = thumbs(source_path, true);
        }
        
        let title = path.parse(source_path).base.toLowerCase().replace('-', ' ').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        let rel = path.relative(root_path, source_path);
        const image = '/pp/' + slash(rel) + '/' + path.parse(tail_image(_images) as any).base;
        const config = read(path.resolve(`${source_path}/config.json`), 'json') as any || {};
        const fmHead = howto_header(config.title || title, config.category || "", config.image || image);
        content = fmHead + '\n\n' + content;
        
        debug.info('test' , path.resolve(`${root_path}/_howto/how-to-${path.parse(source_path).name}.md`));
        write(target_path, content);

        // write(path.resolve(`${root_path}/_howto/how-to-${path.parse(source_path).name}.md`), content);
    });
};

