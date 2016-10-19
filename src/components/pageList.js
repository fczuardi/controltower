import html from 'choo/html';
import messages from '../../locales/ptBr';

export default (pages, selectedPage, classes, selectId) => html`
<select 
    value=${selectedPage.pageId}
    name=${selectId} 
    class=${classes.input}
>
    <option>
        ${messages.channels.facebook.selectAPage}
    </option>
    ${pages.map(page => html`
        <option
            value=${page.id}
            ${(selectedPage.pageId === page.id) ? 'selected' : ''}
        >
            ${page.name}
        </option>
    `)}
</select>`;
