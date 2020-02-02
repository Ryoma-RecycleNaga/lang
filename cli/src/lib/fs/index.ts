const fg = require('fast-glob');
import { Converter } from 'showdown';
import { sync as read } from '@xblox/fs/read';

export const files = (dir, glob) => fg.sync(glob, { dot: true, cwd: dir, absolute: true }) as [];

export { sync as read } from '@xblox/fs/read';
export { sync as exists } from '@xblox/fs/exists';
export { sync as dir } from '@xblox/fs/dir';
export { sync as write } from '@xblox/fs/write';

export const toHTML = (path, markdown) => {
    const content = read(path, 'string') as string;
    if (!markdown) {
        let converter = new Converter();
        converter.setOption('literalMidWordUnderscores', 'true');
        return converter.makeHtml(content);
    } else {
        return content;
    }
}
