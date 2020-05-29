import * as CLI from 'yargs';
import * as debug from '../..';
import { capitalize, substitute } from '../../lib/common/strings';
import * as path from 'path';
const slash = require('slash');

import { write, exists, read, thumbs, images, resize_images, tail_image, howto_header, toHTML, parse_config, read_fragments } from '../../lib/';
import { parse } from 'querystring';

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
        
        debug.info(`Generating Howto for ${source_path}`);

        const root_path = path.resolve(argv.root as any);
        if (!exists(root_path)) {
            debug.error(`\t Cant find root path at ${root_path}, path doesn't exists`);
            return;
        }

        const templates_path = path.resolve(`${root_path}/templates/jekyll`);
        if (!exists(templates_path)) {
            debug.error(`\t Cant find templates at ${templates_path}, path doesn't exists`);
            return;
        }

        const template_path = path.resolve(`${templates_path}/howto.md`);

        const template_local = read(path.resolve(`${source_path}/template.md`), 'string') || '';

        if (!exists(template_path)) {
            debug.error(`\t Cant find template at ${template_path}, path doesn't exists`);
            return;
        }

        const template = template_local || read(template_path, 'string');

        const target_path = `${source_path}/${argv.outfile}`;
        const _images = images(source_path);
        isDebug && debug.info(`\n Generate thumbs from ${source_path} to ${target_path}`);

        if (!exists(source_path)) {
            debug.error(`\t Cant find at ${source_path}, path doesn't exists`);
            return;
        }
        resize && await resize_images(_images);
        let content;
        if (exists(path.resolve(`${source_path}/Readme.md`))) {
            content = toHTML(path.resolve(`${source_path}/Readme.md`), true);
        } else {
            content = thumbs(source_path, true);
        }

        let title = path.parse(source_path).base.toLowerCase().replace('-', ' ').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        let rel = path.relative(root_path, source_path);
        const image = '/pp/' + slash(rel) + '/' + path.parse(tail_image(_images) as any).base;

        const config = read(path.resolve(`${source_path}/config.json`), 'json') as any || {};

        let config_yaml = read(path.resolve(`${source_path}/config.yaml`), 'string') as any || "";

        let header = read(path.resolve(`${templates_path}/howto.header.md`), 'string') as any || "";
        let footer = read(path.resolve(`${templates_path}/howto.footer.md`), 'string') as any || "";

        read_fragments(source_path, config, rel, "md:thumbs");

        parse_config(config, path.parse(source_path));

        config.header_global = substitute(header, config);
        config.footer_global = substitute(footer, config);

        for (const key in config) {
            const resolved = substitute(config[key], config);
            config[key] = resolved;
        }
        
        let out = substitute(template, {
            ...config,
            image: image,
            title,
            thumbs: content,
            config: config_yaml,
            description: config.description || ""
        })
        write(target_path, out);
    });
};

