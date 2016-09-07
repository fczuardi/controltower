import html from 'choo/html';
import messages from '../../locales/ptBr';
import menuComponent from '../components/sideMenu';
import footerComponent from '../components/footer';
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

export default (state, prev, send) => html`
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
