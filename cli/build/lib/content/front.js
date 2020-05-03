"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.howto_header = (title, category, image) => {
    return `---
image: ${image}
category: "${category}"
title: "${title}"
---\n`;
};
exports.machine_header = (title, category, image, slug) => {
    return `---
    image: ${image}
    category: "${category}"
    title: "${title}"
    permalink: /machines/${slug}
    ---\n`;
};
//# sourceMappingURL=front.js.map