import pageListFormComponent from '../components/pageListForm';
import { formClasses, panel, view } from './botSetup';
import messages from '../../locales/ptBr';

const createSubmit = (bot, pages, send) => e => {
    e.preventDefault();
    const newPage = pages[e.target.select.selectedIndex - 1];
    send('api:updateBot', {
        botId: bot.id,
        ownerId: bot.customerId,
        facebookPage: newPage
    });
    return send('bot:setFacebookPage', newPage);
};

// Returns true if the user own or administrates
// any Facebook page, false otherwise.
const hasPages = pages => pages.length !== 0;

export default (state, prev, send) => {
    const pages = state.ui.facebookPages;
    const currentPage = state.bot.facebook;
    const isUpdating = state.api.updatingBot;
    const onSubmit = createSubmit(state.bot, pages, send);
    // just show the form if user has any pages
    const form = hasPages(pages) ? pageListFormComponent(
        pages,
        currentPage,
        isUpdating,
        formClasses,
        messages.channels.facebook,
        onSubmit
    ) : '';
    // set the description according to user's pages number
    const description = hasPages(pages) ?
                messages.channels.facebook.description.trackOrder
                : messages.channels.facebook.description.noPageFoundMessage;
    const panels = [panel(
        form,
        messages.channels.facebook.title,
        description
    )];
    return view(messages.channels.title, panels);
};
