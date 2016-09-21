import { formClasses, view } from '../views/botSetup';
import messages from '../../locales/ptBr';
import repliesFormComponent from '../components/replyListForm';

export default state => {
    const content = repliesFormComponent(
        state.ui.selectedReply,
        formClasses,
        messages.replies.ecommerce
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
