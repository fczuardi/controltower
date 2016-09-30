import { path } from 'ramda';
import { formClasses, view } from '../views/botSetup';
import messages from '../../locales/ptBr';
import repliesFormComponent from '../components/replyListForm';

const createOnChange = send => e => {
    e.preventDefault();
    return send('ui:selectReply', e.target.value);
};

const createOnSubmit = (selectedReplyKey, selectedReply, botId, send) => e => {
    e.preventDefault();
    const fieldNames = ['title', 'text', 'subtitle', 'buttonTitle', 'logo', 'url'];
    let updates = {};
    fieldNames.forEach(fieldName => {
        if (!e.target[fieldName]) {
            return null;
        }
        return Object.assign(updates, { [fieldName]: e.target[fieldName].value });
    });
    if (e.target.buttonTitle) {
        send('replies:setReplyButton', {
            [selectedReplyKey.split('.')[1]]: updates
        });
    } else {
        updates = Object.assign(selectedReply, updates);
        send('replies:setReply', { [selectedReplyKey]: updates });
    }
    return send('replies:sendReplies', botId);
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
export default (state, send) => {
    const selectedReplyKey = state.ui.selectedReply;
    const selectedReply = path(state.ui.selectedReply.split('.'), state.replies);
    const onChange = createOnChange(send);
    const onSubmit = createOnSubmit(selectedReplyKey, selectedReply, state.bot.id, send);
    const content = repliesFormComponent(
        selectedReplyKey,
        state.replies,
        selectedReply,
        classes,
        messages.replies.ecommerce,
        state.api.loadingReplies || state.api.updatingBot,
        onChange,
        onSubmit
    );
    return view(
        content,
        {
            title: messages.replies.title,
            subtitle: messages.replies.ecommerce.title,
            description: messages.replies.ecommerce.description
        }
    );
};
