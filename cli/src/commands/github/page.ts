import * as CLI from 'yargs';
import * as debug from '../..';
import * as utils from '../../lib/common/strings';
import * as path from 'path';
import { files, dir, read, write, toHTML, exists, machine_header, images, gallery_image, csvToMarkdown } from '../../lib';
import { isArray, isString } from 'util';
import ifElse from 'ramda/es/ifElse';


const md_tables = require('markdown-table');

const defaultOptions = (yargs: CLI.Argv) => {
    return yargs.option('src', {
        default: '',
        describe: 'the source path to the page'
    }).option('dst', {
        default: '',
        describe: 'output path'
    })
    .option('template', {
        default: '',
        describe: 'the template for the page'
    })
    .option('templates', {
        default: './',
        describe: 'location of the jekyll templates folder'
    }).option('format', {
        default: 'html',
        describe: 'selects the output format, can be \'html\' or \'md\''
    }).option('debug', {
            default: 'true',
            describe: 'Enable internal debug message'
    })
};

let options = (yargs: CLI.Argv) => defaultOptions(yargs);

// node ./build/main.js jekyll-page --debug=true --templates=../../products/templates/jekyll --src=../../products/_pages/guide_motor.md --dst=../../products/_pages/motors-out.md
export const register = (cli: CLI.Argv) => {
    return cli.command('jekyll-page', 'Creates Jekyll markdown page', options, async (argv: CLI.Arguments) => {
        if (argv.help) { return; }

        const markdown = true;

        const isDebug = argv.debug === 'true';

        // global config
        const cPath = argv.templates ? path.resolve(`${argv.templates}/config.json`) : path.resolve('./config.json');
        isDebug && debug.info(`read config at ${cPath}`);
        
        const config = read(cPath, 'json') as any || {};

        const src_path = path.resolve(`${argv.src}`);
        let parsed = path.parse(src_path);

        const dst_path = path.resolve(`${argv.dst}`);
        
        const templates_path = path.resolve(`${argv.templates}`);

        isDebug && debug.info(`\n Generate page for ${src_path},
            using templates at ${templates_path}`);

        if (!exists(src_path)) {
            debug.error(`\t Cant find page at ${src_path}, path doesn't exists`);
            return;
        }


        let fragments: any = { ...config };

        let page_config = read(path.resolve(`${parsed.dir}/${parsed.name}.json`), 'json') as any || {};
        if(Object.keys(page_config)){
            for (const key in page_config) {
                let val = page_config[key];
                if(isArray(val)){
                    page_config[key] = md_tables(val);
                }else if(isString(val)){
                    if(val.endsWith('.csv')){
                        let csv = path.resolve(`${parsed.dir}/${val}`) as any;
                        if(exists(csv)){
                            csv = read(csv) || "";
                            try{
                                csv = csvToMarkdown(csv);
                                page_config[key] = md_tables(val);
                            }catch(e){
                                debug.error(`Error converting csv to md ${val}`);
                            }
                        }
                    }
                }
            }
            fragments = {...fragments, ...page_config};
        }


        // read all global fragments
        isDebug && debug.info(`Read global fragments at ${templates_path}`);
        let tepmplate_files = files(templates_path, '*.html');
        tepmplate_files.map((f) => fragments[path.parse(f).name] = toHTML(f, markdown));

        tepmplate_files = files(templates_path, '*.md');
        tepmplate_files.map((f) => fragments[path.parse(f).name] = toHTML(f, markdown));

        // compile and write out

        for (const key in fragments) {
            const resolved = utils.substitute(fragments[key], fragments);
            fragments[key] = resolved;
        }

        for (const key in fragments) {
            const resolved = utils.substitute(fragments[key], fragments);
            fragments[key] = resolved;
        }

        let src = read(path.resolve(`${src_path}`), 'string') as any || "";

        let page_yaml = read(path.resolve(`${parsed.dir}/${parsed.name}.yaml`), 'string') as any || "";
        page_yaml = utils.substitute(page_yaml, fragments);

        const content = utils.substitute(src, fragments);

        isDebug && debug.info(`Write jekyll machine page ${dst_path}`);
        
        write(dst_path, content);

    });
};
