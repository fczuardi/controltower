'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _html = require('choo/html');

var _html2 = _interopRequireDefault(_html);

var _ptBr = require('../../locales/ptBr');

var _ptBr2 = _interopRequireDefault(_ptBr);

var _sideMenu = require('../components/sideMenu');

var _sideMenu2 = _interopRequireDefault(_sideMenu);

var _footer = require('../components/footer');

var _footer2 = _interopRequireDefault(_footer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        intents: 'fa fa-quote-right',
        replies: 'fa fa-comments-o',
        mutedChats: 'fa fa-user-times',
        admins: 'fa fa-key',
        debug: 'fa fa-terminal'
    }
};

exports.default = content => (state, prev, send) => {
    if (!state.customer.isLogged) {
        return content(state, prev, send);
    }
    return _html2.default`
<div class="nav-sm ${ dashboardCss }">
    <div class="container body">
        <div class="main_container">
            <div class="col-md-3 left_col">
                <div class="left_col scroll-view">
                    <div class="main_menu_side hidden-print main_menu">
                        ${ (0, _sideMenu2.default)(state.ui, menuClasses, send) }
                    </div>
                </div>
            </div>
            <div class="right_col">
                ${ content(state, prev, send) }
            </div>
            <footer>
                <div class="pull-right">
                    ${ (0, _footer2.default)(_ptBr2.default.footer, state.customer, state.app, send) }
                </div>
                <div class="clearfix"></div>
            </footer>
        </div>
    </div>
</div>
`;
};

module.exports = exports['default'];