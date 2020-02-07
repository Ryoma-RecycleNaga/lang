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
const path = require("path");
const fs_1 = require("fs");
const sanitize = require("sanitize-filename");
const defaultOptions = (yargs) => {
    return yargs.option('input', {
        default: './',
        describe: 'The sources'
    });
};
let options = (yargs) => defaultOptions(yargs);
// npm run build ; node ./build/main.js sanitize-filenames --input=.
exports.register = (cli) => {
    return cli.command('sanitize-filename', 'Removes invalid chars in filenames', options, (argv) => __awaiter(void 0, void 0, void 0, function* () {
        if (argv.help) {
            return;
        }
        const src = path.resolve('' + argv.input);
        if (fs_1.existsSync(src)) {
            sanitize(src);
        }
    }));
};
//# sourceMappingURL=sanitize-filename.js.map