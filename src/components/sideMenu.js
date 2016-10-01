import html from 'choo/html';
import messages from '../../locales/ptBr';

const click = (send, key) => e => {
    e.preventDefault();
    const pathname = `/${key}`;
    send('ui:selectSection', key);
    send('location:set', { pathname });
};

export default (uiState, classes, send) => html`
<ul class=${classes.list}>
${uiState.menu.map(key => (
    !uiState.enabledSections.includes(key) ? null : html`
    <li class=${key === uiState.selectedSection ? classes.active : ''}>
        <a onclick=${click(send, key)}">
            <i class=${classes.icons[key]}></i>
            ${messages.sidebar[key]}
        </a>
    </li>
`))}
</ul>`;
