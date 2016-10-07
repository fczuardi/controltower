import pageListFormComponent from '../components/pageListForm';
import { formClasses, view } from './botSetup';
import messages from '../../locales/ptBr';

const createSubmit = (botId, pages, send) => e => {
    e.preventDefault();
    const newPage = pages[e.target.select.selectedIndex];
    send('api:updateBot', { botId, facebookPage: newPage });
    return send('bot:setFacebookPage', newPage);
};

export default (state, prev, send) => {
    const pages = state.ui.facebookPages;
    const currentPage = state.bot.facebook;
    const isUpdating = state.api.updatingBot;
    const onSubmit = createSubmit(state.bot.id, pages, send);
    const form = pageListFormComponent(
        pages,
        currentPage,
        isUpdating,
        formClasses,
        messages.channels.facebook,
        onSubmit
    );
    return view(form, {
        title: messages.channels.title,
        subtitle: messages.channels.facebook.title,
        description: messages.channels.facebook.description.trackOrder
    });
};
