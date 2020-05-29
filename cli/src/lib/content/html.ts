export const img = (file, label, id = '') => {
    return `<div class="thumb">
            <a href="${file}" _target="_blank" >
                <img id="${id}" src="${file}" width="100%" />
            </a>
            <span class="thumb-label">${label}</span>
        </div>`;
}
