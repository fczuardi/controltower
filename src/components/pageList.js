import html from 'choo/html';

export default (pages, selectedPage, classes, selectId) => html`
<select name=${selectId} class=${classes.input}>
    ${pages.map(page => html`
        <option
            ${(selectedPage.pageId === page.id) ? 'selected' : ''}
        >
            ${page.name}
        </option>
    `)}
</select>`;
