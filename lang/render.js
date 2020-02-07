const stencil = require('./hydrate');

const fs = require('fs');
const path = require('path');

const write = require('@xblox/fs/write');
const cheerio = require('cheerio');

function hydrateComponents(doc) {
  return stencil.hydrateDocument(doc)
    .then((hydrateResults) => {
      // execute logic based on results
      console.log(hydrateResults);
      return hydrateResults;
    });
}

const test = async () => {
  const $ = cheerio.load('');
  const doc = $('doc');
  //hydrateComponents( '<content-page></content-page>');
  const renderedHtml = await stencil.renderToString(
    `<content-page/>`,
    {
      removeBooleanAttributeQuotes: true,
      prettyHtml: true,
      removeScripts:true,
      removeHtmlComments:true,
      removeAttributeQuotes:true,
      removeUnusedStyles:true,
      removeEmptyAttributes:true,
      resourcesUrl:'ads'
    }
  );
  console.log('SERVER RENDERED', renderedHtml.html);
  write.sync('./render.html', renderedHtml.html);
  return renderedHtml;
}
test();


