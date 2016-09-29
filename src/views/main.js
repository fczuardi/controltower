import html from 'choo/html';
import fontAwesome from './fontAwesome';

const css = require('sheetify');

// load bootstrap css in the global scope (keep this comment)
css('bootstrap/dist/css/bootstrap.min.css', { global: true });
// load gentelella css in the global scope (keep this comment)
css('gentelella/build/css/custom.min.css', { global: true });

const mainCss = css`
:host {
    position: absolute;
    width: 100%;
    height: 100%;
}

.checkboxRow {
    width: 20px;
}

.toolbarRefreshButton {
    text-align: right;
}

.user-chat-bubble {
    border-radius: 1.3em 1.3em 0 1.3em;
    color: #fff;
    height: 35px;
    background-color: #0084ff;
    width: auto;
    font-size: 14px;
    text-align: right;
    margin: 1px 0;
    padding: 6px 12px;
    overflow: hidden;
    clear: right;
    float: right;
    word-wrap: break-word;
}

.reply-container {
    clear: both;
}

.reply-body {
    color: #000;
    width: auto;
    font-size: 14px;
    padding: 6px 12px;
    word-wrap: break-word;
    outline: none;
}

.reply-template-generic .reply-body {
    border: 1px solid #cbcbcb;
    border-bottom: none;
}

.reply-title,
.reply-subtitle {
    display: block;
    border: none;
    width: 100%;
    padding-left: 0;
    outline: none;
    resize: none;
}

.reply-title {
    font-weight: 700;
}
.reply-template-button .reply-subtitle,
.reply-template-text .reply-subtitle,
.chat-bubble {
    border-radius: 1.3em 1.3em 1.3em 0;
    min-height: 35px;
    background: none;
    background-color: #f1f0f0;
    color: #000;
    font-size: 14px;
    margin: 1px 0;
    padding: 6px 12px;
    clear: left;
    float: left;
    word-wrap: break-word;
}
.reply-footer {
    clear: both;
    border: 1px solid #cbcbcb;
    overflow: hidden;
}

.reply-template-button .reply-footer {
    border-radius: 1.3em;
}

.reply-template-generic .reply-footer {
    border-radius: 0 0 1.3em 1.3em;
}

.reply-button {
    margin-top: -1px;
    text-align: center;
    color: blue !important;
    font-size: 14px;
    width: 100%;
    padding: 6px 12px;
    border: none;
    border-top: 1px solid #cbcbcb;
    text-transform: uppercase;
    background: none;
}

.reply-template-text .reply-button {
    border: 1px solid #cbcbcb;
}
`;

// module.exports = view => (state, prev, send) => html`
export default view => (state, prev, send) => html`
<div class=${mainCss}>
    ${fontAwesome}
    ${view(state, prev, send)}
</div>`;
