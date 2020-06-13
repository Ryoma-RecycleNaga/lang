"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changelog = exports.changelog_entry = exports.img = void 0;
const constants_1 = require("../../constants");
const js_beautify_1 = require("js-beautify");
exports.img = (file, label, id = '') => {
    return `<div class="thumb">
            <a href="${file}" _target="_blank" >
                <img id="${id}" src="${file}" width="100%" />
            </a>
            <span class="thumb-label">${label}</span>
        </div>`;
};
exports.changelog_entry = (e) => {
    return `<div class="change_log_entry">
        <span><pre>${e.date}&nbsp;</pre></span><span><a href="${constants_1.GIT_REPO}/commit/${e.hash}">${e.msg}</a></span>
        <ul>
        ${e.files.map((f) => {
        return `<li><a href="${constants_1.GIT_REPO}/blob/master/${f.path}>${f.path}</a></li>`;
    })}
        </ul>
    </div>
    `;
};
exports.changelog = (log) => {
    return js_beautify_1.html_beautify(log.map(exports.changelog_entry).join('<br/>'));
};
//# sourceMappingURL=html.js.map