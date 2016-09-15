import html from 'choo/html';

export default (pages, selectedPage, classes, selectId) => html`
<div class=${classes.pageList}>
    <select name=${selectId} class=${classes.select}>
        ${pages.map(page => html`
            <option
                ${(selectedPage.pageId === page.id) ? 'selected' : ''}
            >
                ${page.name}
            </option>
        `)}
    </select>
</div>`;
