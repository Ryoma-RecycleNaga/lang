"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.howto_header = (title, category, image, description = "", tagline = "", config = "") => {
    return `---
image: ${image}
category: "${category}"
title: "${title}"
tagline:${tagline}
description:${description}

${config}
---\n`;
};
exports.machine_header = (title, category, image, slug, description = "", tagline = "", config = "") => {
    return `---
image: ${image}
category: "${category}"
title: "${title}"
permalink: /machines/${slug}
tagline:${tagline}
description:${description}
${config}
sidebar: 
   nav: "machines"
---\n`;
};
//# sourceMappingURL=front.js.map