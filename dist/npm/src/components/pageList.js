'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _html = require('choo/html');

var _html2 = _interopRequireDefault(_html);

var _ptBr = require('../../locales/ptBr');

var _ptBr2 = _interopRequireDefault(_ptBr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (pages, selectedPage, classes, selectId) => _html2.default`
<select 
    value=${ selectedPage.pageId }
    name=${ selectId } 
    class=${ classes.input }
>
    <option>
        ${ _ptBr2.default.channels.facebook.selectAPage }
    </option>
    ${ pages.map(page => _html2.default`
        <option
            value=${ page.id }
            ${ selectedPage.pageId === page.id ? 'selected' : '' }
        >
            ${ page.name }
        </option>
    `) }
</select>`;

module.exports = exports['default'];