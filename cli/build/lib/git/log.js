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
exports.git_log = exports.git_status = void 0;
const debug = require("../..");
const constants_1 = require("../../constants");
const path = require("path");
const simpleGit = require("simple-git/promise");
const moment = require("moment");
function git_status(cwd, dir) {
    return __awaiter(this, void 0, void 0, function* () {
        const git = simpleGit(cwd);
        let statusSummary = null;
        try {
            statusSummary = yield git.log(['--stat', path.resolve(dir)]);
        }
        catch (e) {
            debug.error('Error Git', e);
        }
        return statusSummary;
    });
}
exports.git_status = git_status;
function git_log(cwd, dir) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = yield git_status(cwd, dir);
        let changelogs = stats.all.filter((e) => e.message.trim().toLowerCase().startsWith(constants_1.GIT_CHANGELOG_MESSAGE_PREFIX.toLowerCase()));
        if (!changelogs.length) {
            return [];
        }
        let pretty = changelogs.map((e) => {
            return {
                files: e.diff.files.map((f) => { return { path: f.file }; }),
                msg: e.message.replace(constants_1.GIT_CHANGELOG_MESSAGE_PREFIX, '').trim(),
                hash: e.hash,
                date: moment(e.date).format('LLLL')
            };
        });
        return pretty;
    });
}
exports.git_log = git_log;
;
//# sourceMappingURL=log.js.map