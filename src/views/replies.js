import { formClasses, view } from '../views/botSetup';
import messages from '../../locales/ptBr';
import repliesFormComponent from '../components/replyListForm';

const createOnChange = send => e => {
    e.preventDefault();
    return send('ui:selectReply', e.target.value);
};

export default (state, send) => {
    const onChange = createOnChange(send);
    const content = repliesFormComponent(
        state.ui.selectedReply,
        state.replies,
        formClasses,
        messages.replies.ecommerce,
        state.api.loadingReplies,
        onChange
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
