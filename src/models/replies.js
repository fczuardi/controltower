import { merge } from 'ramda';
const repliesModel = {
    namespace: 'replies',
    state: {
    },
    reducers: {
        set: (state, data) => data,
        setReply: (state, data) => merge(state, data),
        setSampleQuestion: (state, data) => ({
            ...state,
            [data.intent]: (state[data.intent]
                ? Object.assign(state[data.intent], { sampleQuestion: data.utterance })
                : { text: '', sampleQuestion: data.utterance }
            )
        })
    },
    effects: {
        sendReplies: (state, bot, send, done) => send('api:updateBot', {
            botId: bot.id,
            ownerId: bot.customerId,
            replies: JSON.stringify(state)
        }, done)
    }
};

export default repliesModel;
