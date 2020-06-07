import { write, exists, read, thumbs, images, resize_images, tail_image, howto_header, substitute, toHTML, parse_config, read_fragments } from '../../lib/';
import * as debug from '../..';
import * as path from 'path';

import simpleGit, { SimpleGit, ListLogSummary } from 'simple-git';

export async function git_status(cwd, dir) {
    let statusSummary: ListLogSummary = null;
    try {
        statusSummary = await simpleGit(cwd).log(['--stat', path.resolve(dir)]);
    }
    catch (e) {
        debug.error('Error Git', e);
    }
    return statusSummary;
}

export async function git_log(cwd, dir){
    
};