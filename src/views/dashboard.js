const html = require('choo/html');
const messages = require('../../locales/ptBr');
const menuComponent = require('../components/sideMenu');
const footerComponent = require('../components/footer');
const css = require('sheetify');
const dashboardCss = css`
.right_col {
    min-height: 1000px;
}
`;
const menuClasses = {
    list: 'nav side-menu',
    active: 'active',
    homeIcon: 'fa fa-home'
};

module.exports = (state, prev, send) => html`
<div class="nav-sm ${dashboardCss}">
    <div class="container body">
        <div class="main_container">
            <div class="col-md-3 left_col">
                <div class="left_col scroll-view">
                    <div class="main_menu_side hidden-print main_menu">
                        ${menuComponent(menuClasses)}
                    </div>
                </div>
            </div>
            <div class="right_col">
            <h1>Customer</h1>
<code><pre>${JSON.stringify(state.customer, ' ', 2)}</pre></code>
            <h1>Bot</h1>
<code><pre>${JSON.stringify(state.bot, ' ', 2)}</pre></code>
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
