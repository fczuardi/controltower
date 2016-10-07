import vtexFormComponent from '../components/vtexForm';
import { formClasses, view } from '../views/botSetup';
import messages from '../../locales/ptBr';

const createSubmit = (botId, send) => e => {
    e.preventDefault();
    const fieldNames = [
        'apiToken',
        'apiKey',
        'apiAccountName',
        'apiEnvironment',
        'appKey',
        'appToken'
    ];
    const update = fieldNames.reduce((prev, name) =>
        Object.assign(prev, {
            [name]: e.target[name].value
        })
    , {});
    send('api:updateBot', { botId, vtex: update });
    return send('bot:setVtexStore', update);
};

export default (state, prev, send) => {
    const isUpdating = state.api.updatingBot;
    const values = state.bot.vtex;
    const onSubmit = createSubmit(state.bot.id, send);
    const form = vtexFormComponent(
        isUpdating,
        values,
        formClasses,
        messages.ecommerce.vtex,
        onSubmit
    );
    return view(form, {
        title: messages.ecommerce.title,
        subtitle: messages.ecommerce.vtex.title,
        description: messages.ecommerce.vtex.description.trackOrder
    });
};
