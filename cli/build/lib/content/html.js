"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.img = (file, id = '') => {
    return `<div class="thumb">
            <a href="${file}" _target="_blank" >
                <img id="${id}" src="${file}" width="100%" />
            </a>
        </div>`;
};
//# sourceMappingURL=html.js.map