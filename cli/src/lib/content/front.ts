export const howto_header = (title, category, image) => {
return `---
image: ${image}
category: "${category}"
title: "${title}"
---\n`;
}