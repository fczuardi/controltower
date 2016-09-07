import html from 'choo/html';

export default classes => html`
<ul class=${classes.list}>
    <li class=${classes.active}>
        <a>
            <i class=${classes.homeIcon}></i>
        </a>
    </li>
</ul>`;
