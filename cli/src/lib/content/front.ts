export const howto_header = (title, category, image) => {
return `---
image: ${image}
category: "${category}"
title: "${title}"
---\n`;
}

export const machine_header = (title, category, image,slug) => {
    return `---
    image: ${image}
    category: "${category}"
    title: "${title}"
    permalink: /machines/${slug}
    ---\n`;
}
