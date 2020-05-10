"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.howto_header = (title, category, image, config = "") => {
    return `---
image: ${image}
category: "${category}"
title: "${title}"
${config}
---\n`;
};
exports.machine_header = (title, category, image, slug, config = "") => {
    return `---
image: ${image}
category: "${category}"
title: "${title}"
permalink: /machines/${slug}
${config}
sidebar: 
   nav: "machines"
---\n`;
};
//# sourceMappingURL=front.js.map