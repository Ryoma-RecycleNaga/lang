export const howto_header = (title, category, image, description: string = "", tagline: string = "", config: string = "") => {
   return `---
image: ${image}
category: "${category}"
title: "${title}"
tagline:${tagline}
description:${description}

${config}
---\n`;
}

export const machine_header = (title, category, image, slug, description: string = "", tagline: string = "", config: string = "") => {
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
}
