"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sizeToString = void 0;
exports.sizeToString = (bytes, si = true) => {
    var units;
    var u;
    var b = bytes;
    var thresh = si ? 1000 : 1024;
    if (Math.abs(b) < thresh) {
        return b + ' B';
    }
    units = si
        ? ['kB', 'MB', 'GB', 'TB']
        : ['KiB', 'MiB', 'GiB', 'TiB'];
    u = -1;
    do {
        b /= thresh;
        ++u;
    } while (Math.abs(b) >= thresh && u < units.length - 1);
    return b.toFixed(1) + ' ' + units[u];
};
//# sourceMappingURL=formatter.js.map