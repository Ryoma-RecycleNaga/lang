import * as debug from '../..';
import * as path from 'path';
import { isArray, isString } from 'util';
import * as CLI from 'yargs';

import * as utils from '../../lib/common/strings';
import { files, dir, read, write, csvToMarkdown, toHTML, exists, machine_header, images, gallery_image } from '../../lib/';


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

export const read_fragments = (src, config) => {

  let fragments = files(src, '*.html');
  fragments.map((f) => config[path.parse(f).name] = toHTML(f, true));

  fragments = files(src, '*.md');
  fragments.map((f) => config[path.parse(f).name] = toHTML(f, false));

  return config;
}