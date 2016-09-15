import html from 'choo/html';

export default (pages, classes) => html`
<div class=${classes.pageList}>
    <select class=${classes.select}>
        ${pages.map(page => html`
            <option>
                ${page.name}
            </option>
        `)}
    </select>
</div>`;
