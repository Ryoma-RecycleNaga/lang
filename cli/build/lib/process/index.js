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
const debug = require("../../log");
const child_process_1 = require("child_process");
const platform_1 = require("../common/platform");
var STATUS;
(function (STATUS) {
    STATUS[STATUS["OK"] = 0] = "OK";
    STATUS[STATUS["ERROR"] = 1] = "ERROR";
    STATUS[STATUS["PENDING"] = 2] = "PENDING";
})(STATUS = exports.STATUS || (exports.STATUS = {}));
const fatalHandler = (message, fn) => {
    if (message.startsWith('fatal:')) {
        fn('\t\ ' + message);
        return true;
    }
    return false;
};
// tslint:disable-next-line:no-empty
const subscribe = (signal, collector = () => { }) => {
    const buffer = [];
    signal.on('message', (message) => debug.debug('message', message));
    signal.on('error', (error) => debug.error('std-error', error));
    signal.on('data', (data) => {
        const message = data.toString();
        buffer.push(message); // .replace(/[\x00-\x1F\x7F-\x9F]/g, "")
        collector(buffer);
    });
};
const merge = (buffer, data) => buffer.concat(data);
const hook = (process, resolve, reject, cmd) => {
    let buffer = [];
    const collector = (data) => { buffer = buffer.concat(data); };
    const stdout = subscribe(process.stdout, collector);
    const stderr = subscribe(process.stderr, collector);
    process.on('exit', (code, signal) => {
        if (code) {
            resolve({
                code: STATUS.ERROR,
                command: cmd,
                error: code,
                messages: buffer
            });
        }
        else {
            resolve({
                code: STATUS.OK,
                command: cmd,
                messages: buffer
            });
        }
    });
    return process;
};
class Process {
    constructor(options = {}) {
        this.binary = 'magick';
        this.cwd = '';
        this.args = '';
        this.binary = options.binary || this.binary;
        //this.binary = path.resolve(which(this.binary));
        this.cwd = options.cwd || process.cwd();
    }
    optionsToString(options) {
        const args = [];
        // tslint:disable-next-line:forin
        for (const k in options) {
            const val = options[k];
            if (k.length === 1) {
                // val is true, add '-k'
                if (val === true) {
                    args.push('-' + k);
                }
                else if (val !== false) {
                    // if val is not false, add '-k val'
                    args.push('-' + k + ' ' + val);
                }
            }
            else {
                if (val === true) {
                    args.push('--' + k);
                }
                else if (val !== false) {
                    args.push('--' + k + '=' + val);
                }
            }
        }
        return args.join(' ');
    }
    optionsToArray(options) {
        const args = [];
        // tslint:disable-next-line:forin
        for (const k in options) {
            const val = options[k];
            if (k.length === 1) {
                // val is true, add '-k'
                if (val === true) {
                    args.push('-' + k);
                }
                else if (val !== false) {
                    // if val is not false, add '-k val'
                    args.push('-' + k + ' ' + val);
                }
            }
            else {
                if (val === true) {
                    args.push('--' + k);
                }
                else if (val !== false) {
                    args.push('--' + k + '=' + val);
                }
            }
        }
        return args;
    }
    exec(command, options = {}, args = []) {
        return __awaiter(this, void 0, void 0, function* () {
            args = [command].concat(args);
            return new Promise((resolve, reject) => {
                const p = child_process_1.exec(this.binary + ' ' + args.join(' '), {
                    cwd: this.cwd
                });
                return hook(p, resolve, reject, this.binary + ' ' + args.join(' '));
            });
        });
    }
}
exports.Process = Process;
class Helper {
    static run(cwd, command, gitArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const gitProcess = new Process({
                cwd: cwd,
                binary: platform_1.os() == 'windows' ? 'magick' : ''
            });
            const p = gitProcess.exec(command, {}, gitArgs);
            const spinner = debug.spinner('Run ' + command + ' with ' + gitArgs.join(' ')).start();
            p.then(() => spinner.stopAndPersist());
            p.catch((e) => debug.error('Error git command : ' + command));
            return p;
        });
    }
}
exports.Helper = Helper;
//# sourceMappingURL=index.js.map