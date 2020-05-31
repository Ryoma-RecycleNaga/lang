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
exports.gallery_image = (path, title = "", alt = "") => {
    return `
 - url: "${path}"
   image_path: "${path}"
   alt: "${alt}"
   title: "${title}"`;
};
exports.drawing_image = (path, pdf, title = "", alt = "") => {
    return `
 - url: "${pdf}"
   image_path: "${path}"
   alt: "${alt}"
   title: "${title}"`;
};
exports.machine_header = (title, category, image, slug, rel, description = "", tagline = "", config = "") => {
    return `---
image: ${image}
category: "${category}"
title: "${title}"
permalink: /machines/${slug}
product_rel: "/pp/${rel}"
tagline: ${tagline || '""'}
description: ${description || `"Precious Plastic - Machine : ${strings_1.capitalize(category)} :: ${title}"`}
${config}
sidebar: 
   nav: "machines"
---\n`;
};
//# sourceMappingURL=front.js.map