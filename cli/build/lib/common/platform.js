"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
exports.os = () => {
    if (os_1.platform() === 'win32') {
        return 'windows';
    }
    else if (os_1.platform() === 'darwin') {
        return 'osx';
    }
    else if (os_1.arch() === 'arm') {
        return 'arm';
    }
    return 'linux';
};
//# sourceMappingURL=platform.js.map