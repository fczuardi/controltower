import intentsFormComponent from '../components/intentsForm';
import messages from '../../locales/ptBr';
import { formClasses, panel, view } from '../views/botSetup';

export default (state, prev, send) => {
    const content = intentsFormComponent(state, send, formClasses, messages.intents.faq);
    const panels = [
        panel(content, messages.intents.faq.title, messages.intents.faq.description)
    ];
    return view(messages.intents.title, panels);
};
