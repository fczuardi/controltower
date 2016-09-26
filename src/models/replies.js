import { merge } from 'ramda';
const repliesModel = {
    namespace: 'replies',
    state: {
        start: {
            template: 'generic',
            text: 'Por favor, selecione uma das opções abaixo ou digite o que deseja.',
            buttons: ['trackOrder', 'returnsSubmenu', 'talkToHuman']
        },
        trackOrder: {
            sampleQuestion: 'Meu número de pedido é 1234567890',
            template: 'generic',
            title: 'Pedido #{{ orderId }} - Status',
            text: 'Destino: {{ address }}',
            buttons: ['returnsSubmenu', 'talkToHuman']
        },
        receipt: {
            sampleQuestion: 'Onde encontro a nota fiscal?',
            template: 'button',
            text: 'A nota fiscal é enviada junto ao pedido. Você pode pedir'
                + 'uma segunda via clicando no botão abaixo.',
            buttons: ['printReceiptLink', 'backToMenu', 'talkToHuman']
        },
        returns: {
            template: 'button',
            text: 'O prazo para solicitação de troca é de 30 dias corridos,'
                + ' a contar da data de recebimento do produto.',
            buttons: ['returnsLink', 'backToMenu', 'talkToHuman']
        },
        talkToHuman: {
            sampleQuestion: 'Quero falar com um humano',
            text: 'Só um instante, um humano já irá te atender.'
        },
        thanks: {
            sampleQuestion: 'Ok, muito obrigado!',
            text: 'Nós que agradecemos, volte sempre.'
        },
        buttons: {
            printReceiptLink: 'Segunda Via',
            backToMenu: 'Voltar ao Menu',
            trackOrder: 'Rastrear Pedido',
            returnsSubmenu: 'Trocas e Devoluções',
            returnsLink: 'Trocar ou Devolver',
            talkToHuman: 'Falar com um Humano'
        }
    },
    reducers: {
        set: data => data,
        setReplyButton: (data, state) => ({
            ...state,
            buttons: merge(state.buttons, data)
        }),
        setReply: (data, state) => merge(state, data)
    },
    effects: {
        sendReplies: (botId, state, send, done) => send('api:updateBot', {
            botId,
            replies: JSON.stringify(state)
        }, done)
    }
};

export default repliesModel;
