const state = {
    start: {
        template: 'generic',
        title: 'Bem vindo ao SAC do sample_store',
        subtitle: 'Por favor, selecione uma das opções abaixo ou então digite o que deseja',
        buttons: ['trackOrder', 'exchange', 'humanFallback'],
        logo: 'http://example.com/image.png'
    },
    exchange: {
        template: 'button',
        text: 'A sample_store respeita o direito do consumidor à troca ou à '
            + 'devolução de produtos, seja por defeito ou arrependimento, '
            + 'cumprindo a Lei Federal nº 8.078 de 1990 e o Código de '
            + 'Defesa do Consumidor. Se quiser proseguir, selecione '
            + '"Trocar ou devolver"',
        buttons: ['exchange', 'menu', 'deactivate']
    },
    menu: {
        template: 'generic',
        subtitle: 'Por favor, selecione uma das opções abaixo ou então digite o que deseja',
        buttons: ['trackOrder', 'exchange', 'deactivate'],
        logo: 'http://example.com/image.png'
    },
    deactivate: {
        text: 'Um atendente virá te atender em breve. Por favor, aguarde um momento\n'
    },
    faqId: {
        template: 'generic',
        title: 'Número do pedido',
        subtitle: 'Pode ser encontrado no e-mail de confirmação da compra',
        buttons: ['menu']
    },
    faqReceipt: {
        template: 'button',
        text: 'Sua nota fiscal esta localizada no ultimo lugar onde você a colocou',
        buttons: ['receipt', 'menu', 'deactivate']
    },
    faqReturn: {
        template: 'button',
        text: 'A sample_store respeita o direito do consumidor à troca ou à '
            + 'devolução de produtos.',
        buttons: ['returns', 'menu', 'deactivate']
    },
    help: {
        template: 'generic',
        title: 'Bem vindo ao SAC do sample_store',
        subtitle: 'Por favor, selecione uma das opções abaixo ou então digite o que deseja',
        buttons: ['trackOrder', 'exchange', 'deactivate'],
        logo: 'http://example.com/image.png'
    },
    trackOrder: {
        hasNoOrderId: {
            template: 'button',
            text: 'Por favor, informe o número de pedido',
            buttons: ['hasNoOrderId']
        },
        hasOrderId: {
            text: 'Por favor, informe o número de pedido'
        },
        userLoggedWelcome: {
            text: 'Bem vindo de volta {{userName}}'
        },
        localOrders: {
            template: 'generic',
            title: 'Pedido #{{orderId}} feito em {{date}}',
            buttons: ['select']
        },
        apiCall: {
            title: 'Pedido # {{orderId}} - {{status}}',
            subtitle: '{{text}} | Previsto para {{date}}',
            template: 'generic',
            buttons: ['thanks', 'returns', 'deactivate']
        }
    },
    thankUser: {
        text: 'Nós que agradecemos. Volte sempre.'
    },
    apiHandler: {
        wrongNumber: {
            text: 'Por favor, entre com um numero de pedido valido.'
        },
        systemError: {
            text: 'Sinto muito, mas o sistema da loja esta fora do ar no'
                + ' momento.\n Experimente falar comigo novamente mais tarde.'
        }
    },
    fallback: {
        text: 'Não entendi, estou passando para um atendente'
    },
    askForAMoment: {
        text: 'Só um instante, estou consultando o meu sistema...'
    },
    buttons: {
        thanks: {
            text: 'Obrigado, foi útil'
        },
        trackOrder: {
            text: 'Rastrear meu pedido'
        },
        exchange: {
            text: 'Politica de trocas',
            url: 'http://example.com/exchanges'
        },
        humanFallback: {
            text: 'Falar com um humano'
        },
        returns: {
            text: 'Trocas/Devoluções',
            url: 'http://example.com/returns'
        },
        receipt: {
            text: 'Saiba Mais',
            url: 'http://example.com/receipt'
        },
        menu: {
            text: 'Voltar ao menu'
        },
        deactivate: {
            text: 'Falar com um humano'
        },
        select: {
            text: 'Selecionar'
        },
        hasNoOrderId: {
            text: 'Não sei meu número'
        }
    }
};
export default state;
