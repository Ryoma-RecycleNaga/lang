export const img = (file, id = '') => {
    return `<div class="thumb">
            <a href="${file}" _target="_blank" >
                <img id="${id}" src="${file}" width="100%" />
            </a>
        </div>`;
}
