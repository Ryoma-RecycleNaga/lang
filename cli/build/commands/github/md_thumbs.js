"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("../..");
const path = require("path");
const lib_1 = require("../../lib/");
const defaultOptions = (yargs) => {
    return yargs.option('source', {
        default: '.',
        describe: ''
    }).option('resize', {
        default: 'false',
        describe: 'resize images'
    }).option('outfile', {
        default: 'thumb.md',
        describe: 'the name of the output file'
    });
};
let options = (yargs) => defaultOptions(yargs);
// node ./build/main.js md:thumbs --debug=true --source=../../products/howto/controlbox/media
exports.register = (cli) => {
    return cli.command('md:thumbs', 'Create a thumbnail grid from the current directory ', options, (argv) => __awaiter(void 0, void 0, void 0, function* () {
        if (argv.help) {
            return;
        }
        const isDebug = argv.debug === 'true';
        const resize = argv.resize === 'true';
        const source_path = path.resolve(argv.source);
        const target_path = `${source_path}/${argv.outfile}`;
        isDebug && debug.info(`\n Generate thumbs from ${source_path} to ${target_path}`);
        if (!lib_1.exists(source_path)) {
            debug.error(`\t Cant find at ${source_path}, path doesn't exists`);
            return;
        }
        resize && (yield lib_1.resize_images(lib_1.images(source_path)));
        lib_1.write(target_path, lib_1.thumbs(source_path, true));
    }));
};
//# sourceMappingURL=md_thumbs.js.map