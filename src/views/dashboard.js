const html = require('choo/html');
const messages = require('../../locales/ptBr');
const menuComponent = require('../components/sideMenu');
const footerComponent = require('../components/footer');
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
        mutedChats: 'fa fa-user-times'
    }
};

module.exports = content => (state, prev, send) => html`
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
