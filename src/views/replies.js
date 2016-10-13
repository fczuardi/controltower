import { path } from 'ramda';
import { formClasses, panel, view } from '../views/botSetup';
import messages from '../../locales/ptBr';
import repliesFormComponent from '../components/replyListForm';

const createOnChange = send => e => {
    e.preventDefault();
    send('ui:selectReply', e.target.value);
    return send('location:set', { pathname: '/replies' });
};

const createOnSubmit = (selectedReplyKey, selectedReply = {}, bot, send) => e => {
    e.preventDefault();
    const fieldNames = ['title', 'text', 'subtitle', 'logo', 'url'];
    let updates = {};
    fieldNames.forEach(fieldName => {
        if (!e.target[fieldName]) {
            return null;
        }
        return Object.assign(updates, { [fieldName]: e.target[fieldName].value });
    });
    updates = Object.assign(selectedReply, updates);
    send('replies:setReply', { [selectedReplyKey]: updates });
    return send('replies:sendReplies', bot);
};

const replyClasses = {
    sampleQuestion: 'user-chat-bubble',
    title: 'reply-title',
    subtitle: 'reply-subtitle',
    body: 'reply-body',
    footer: 'reply-footer',
    button: 'reply-button',
    container: 'reply-container col-md-8 col-sm-8 col-xs-12',
    template: {
        button: 'reply-template-button',
        generic: 'reply-template-generic',
        none: 'reply-template-text'
    }
};

const classes = Object.assign({}, formClasses, { reply: replyClasses });
export default (state, prev, send) => {
    const selectedReplyKey = state.ui.selectedReply;
    const selectedReply = selectedReplyKey
        ? path(state.ui.selectedReply.split('.'), state.replies)
        : null;
    const replyTitles = state.intents.names
        .filter(name => name !== 'none')
        .reduce((previous, name) => Object.assign(previous, { [name]: name })
        , {});
    const onChange = createOnChange(send);
    const onSubmit = createOnSubmit(selectedReplyKey, selectedReply, state.bot, send);
    const content = repliesFormComponent(
        replyTitles,
        selectedReplyKey,
        state.replies,
        selectedReply,
        state.intents.utterances,
        classes,
        messages.replies.ecommerce,
        state.api.loadingBot || state.api.updatingBot,
        onChange,
        onSubmit
    );
    const panels = [panel(
        content,
        messages.replies.ecommerce.title,
        messages.replies.ecommerce.description
    )];
    return view(messages.replies.title, panels);
};
