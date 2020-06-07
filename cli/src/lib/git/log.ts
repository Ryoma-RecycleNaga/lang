import { write, exists, read, thumbs, images, resize_images, tail_image, howto_header, substitute, toHTML, parse_config, read_fragments } from '../../lib/';
import * as debug from '../..';
import { GIT_CHANGELOG_MESSAGE_PREFIX } from '../../constants';
import * as path from 'path';

import * as simpleGit from 'simple-git/promise';
import { SimpleGit, ListLogSummary } from 'simple-git';

export async function git_status(cwd, dir) {

    const git: SimpleGit = simpleGit(cwd);
    let statusSummary: ListLogSummary = null;
    try {
        statusSummary = await git.log(['--stat', path.resolve(dir)]);
    }
    catch (e) {
        debug.error('Error Git', e);
    }
    return statusSummary;
}

export async function git_log(cwd, dir) {
    const stats = await git_status(cwd, dir);
    let changelogs = stats.all.filter((e) => e.message.trim().startsWith(GIT_CHANGELOG_MESSAGE_PREFIX));
    if (!changelogs.length) {
        return [];
    }
    let pretty = changelogs.map((e) => 
    {
        return {
            files: e.diff.files.map((f)=>{ return {path:f.file}}),
            msg: e.message.replace(GIT_CHANGELOG_MESSAGE_PREFIX, '').trim(),
            hash: e.hash,
            date: new Date(e.date).toISOString().split('T')[0]
        }
    });
    return pretty;
};