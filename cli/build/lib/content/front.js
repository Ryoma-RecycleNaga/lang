"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strings_1 = require("../common/strings");
exports.howto_header = (title, category, image, description = "", tagline = "", config = "") => {
    return `---
image: ${image}
category: "${category}"
title: "${title}"
tagline: ${tagline || '""'}
description: ${description || `"Precious Plastic - Howto : ${category} :: ${title} "`}
${config}
---\n`;
};
exports.machine_header = (title, category, image, slug, description = "", tagline = "", config = "") => {
    return `---
image: ${image}
category: "${category}"
title: "${title}"
permalink: /machines/${slug}
tagline: ${tagline || '""'}
description: ${description || `"Precious Plastic - Howto : ${strings_1.capitalize(category)} :: ${title}"`}
${config}
sidebar: 
   nav: "machines"
---\n`;
};
//# sourceMappingURL=front.js.map