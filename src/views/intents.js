import intentsFormComponent from '../components/intentsForm';
import messages from '../../locales/ptBr';
import { formClasses, panel, view } from '../views/botSetup';

export default (state, prev, send) => {
    const onSubmit = e => {
        e.preventDefault();
        console.log('new intent or new utterance', e.target);
        if (e.target.intentName && e.target.intentName.value) {
            // new intent
            send('sage:createIntent', e.target.intentName.value);
        }
        if (e.target.newUtterance && e.target.newUtterance.value) {
            console.log(e.target.newUtterance.value);
            // new utterance
            send('sage:createUtterance', {
                utterance: e.target.newUtterance.value,
                intent: e.target.intentSelect.value
            });
            send('replies:setSampleQuestion', {
                utterance: e.target.newUtterance.value,
                intent: e.target.intentSelect.value
            });
        }
    };
    const content = intentsFormComponent(state, send, formClasses,
                                messages.intents.faq, false, onSubmit);
    const panels = [
        panel(content, messages.intents.faq.title,
                    messages.intents.faq.description)
    ];
    return view(messages.intents.title, panels);
};
