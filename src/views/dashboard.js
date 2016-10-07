import html from 'choo/html';
import messages from '../../locales/ptBr';
import menuComponent from '../components/sideMenu';
import footerComponent from '../components/footer';

const css = require('sheetify');
const dashboardCss = css`
.right_col {
    min-height: 600px;
}
`;
const menuClasses = {
    list: 'nav side-menu',
    active: 'active',
    icons: {
        home: 'fa fa-home',
        channels: 'fa fa-whatsapp',
        ecommerce: 'fa fa-shopping-cart',
        replies: 'fa fa-comments-o',
        mutedChats: 'fa fa-user-times',
        debug: 'fa fa-terminal'
    }
};

export default content => (state, send) => html`
<div class="nav-sm ${dashboardCss}">
    <div class="container body">
        <div class="main_container">
            <div class="col-md-3 left_col">
                <div class="left_col scroll-view">
                    <div class="main_menu_side hidden-print main_menu">
                        ${menuComponent(state.ui, menuClasses, send)}
                    </div>
                </div>
            </div>
            <div class="right_col">
                ${content(state, send)}
            </div>
            <footer>
                <div class="pull-right">
                    ${footerComponent(messages.footer, state.customer, state.app, send)}
                </div>
                <div class="clearfix"></div>
            </footer>
        </div>
    </div>
</div>
`;
