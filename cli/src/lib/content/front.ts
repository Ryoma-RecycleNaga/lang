export const howto_header = (title, category, image, config: string = "") => {
return `---
image: ${image}
category: "${category}"
title: "${title}"
${config}
---\n`;
}

export const machine_header = (title, category, image, slug, config: string = "") => {
return `---
image: ${image}
category: "${category}"
title: "${title}"
permalink: /machines/${slug}
${config}
sidebar: 
   nav: "machines"
---\n`;
}
