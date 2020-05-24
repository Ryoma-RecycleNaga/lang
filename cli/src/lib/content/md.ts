import * as debug from '../..';
import * as path from 'path';
import { isArray, isString } from 'util';
import * as CLI from 'yargs';

import * as utils from '../../lib/common/strings';
import { files, dir, read, write, csvToMarkdown, toHTML, exists, machine_header, images, gallery_image } from '../../lib/';
import { html_beautify } from 'js-beautify';

const md_tables = require('markdown-table');

export const parse_config = (config, root) => {
  if (Object.keys(config)) {
    for (const key in config) {
      let val = config[key];
      if (isArray(val)) {
        config[key] = md_tables(val);
      } else if (isString(val)) {
        if (val.endsWith('.csv')) {
          const parsed = path.parse(root);
          let csv = path.resolve(`${parsed.dir}/${val}`) as any;
          if (exists(csv)) {
            csv = read(csv) || "";
            try {
              csv = csvToMarkdown(csv);
              config[key] = csv;
            } catch (e) {
              debug.error(`Error converting csv to md ${val}`);
            }
          }
        }
      }
    }
  }
}

export const md_edit_wrap = (content, f, prefix = '', context = '') => {
  return html_beautify(`<div prefix="${prefix}" file="${path.parse(f).base}" context="${context}" class="fragment">${content}</div>`);
}

export const read_fragments = (src, config, prefix = '', context = '') => {

  let fragments = files(src, '*.html');
  fragments.map((f) => {
    config[path.parse(f).name] = md_edit_wrap(toHTML(f, true), f, prefix, context);
  });

  fragments = files(src, '*.md');
  fragments.map((f) => {
    config[path.parse(f).name] = md_edit_wrap(toHTML(f, false), f, prefix, context);
  });
  return config;
}