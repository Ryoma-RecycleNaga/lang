import * as debug from '../..';
import * as path from 'path';
import { read, exists, csvToMarkdown } from '../../lib';
import { isArray, isString } from 'util';


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