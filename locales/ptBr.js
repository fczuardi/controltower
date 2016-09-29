const formLabels = {
    cancelButton: 'Cancelar',
    submitButton: 'Enviar'
};

export default {
    login: {
        title: 'Entrada',
        subtitle: 'Para acessar a Torre de Controle é necessário identificar-se.',
        fbSignInButton: 'Acessar com Facebook'
    },
    sidebar: {
        home: 'Home',
        channels: 'Canais',
        ecommerce: 'E-commerce',
        replies: 'Respostas',
        mutedChats: 'Assistentes silenciados'
    },
    footer: {
        appName: version => `• Control Tower v${version} •`,
        viewSource: 'ver código-fonte'
    },
    signInToggle: {
        signIn: 'Entrar',
        signOut: 'Sair'
    },
    channels: {
        title: 'Configurar Canais',
        facebook: {
            title: 'Facebook Messenger',
            description: {
                trackOrder: `
                    Selecione uma página para ser o contato de
                    Facebook Messenger com o qual as pessoas farão consultas de
                    rastreio de pedidos via chat.
                `
            },
            page: 'Página',
            cancel: formLabels.cancelButton,
            submit: formLabels.submitButton
        }
    },
    ecommerce: {
        title: 'Integração com APIs de E-commerce',
        vtex: {
            title: 'VTEX Store',
            description: {
                trackOrder: `
                    Informe os dados da VTEX Store a ser usada para consultar o
                    status de pedidos dos clientes.
                `
            },
            apiToken: 'API Token',
            apiKey: 'API Key',
            apiAccountName: 'API Account Name',
            apiEnvironment: 'API Environment',
            appKey: 'App Key',
            appToken: 'App Token',
            cancel: formLabels.cancelButton,
            submit: formLabels.submitButton
        }
    },
    replies: {
        title: 'Editar Respostas',
        ecommerce: {
            title: 'E-commerce',
            description: `
                Selecione abaixo uma das respostas para editar seu texto.
            `,
            reply: 'Resposta',
            replyTitles: {
                start: 'Menu Inicial',
                exchange: 'Trocas',
                menu: 'Menu',
                deactivate: 'Transferir para um humano',
                faqId: 'Dúvida: número do pedido',
                faqReceipt: 'Dúvida: nota fiscal',
                faqReturn: 'Dúvida: trocas e devoluções',
                help: 'Ajuda (Menu SAC)',
                trackOrder: {
                    title: 'Rastreamento de Pedidos',
                    hasNoOrderId: 'Sem número de pedido',
                    hasOrderId: 'Com número de pedido',
                    userLoggedWelcome: 'Boas vindas (usuário recorrente)',
                    localOrders: 'Seleção de pedido',
                    apiCall: 'Status do pedido'
                },
                thankUser: 'Agradecimento',
                apiHandler: {
                    title: 'Erros',
                    wrongNumber: 'Número de pedido inválido',
                    systemError: 'Sistema fora do ar'
                },
                fallback: 'Resposta não compreendida, transferência',
                askForAMoment: 'Espere um momento',
                buttons: {
                    title: 'Botões',
                    trackOrder: 'Rastrear meu pedido',
                    exchange: 'Política de Trocas (link)',
                    humanFallback: 'Falar com um humano',
                    returns: 'Trocas/Devoluções (link)',
                    receipt: 'Saiba mais, nota fiscal (link)',
                    menu: 'Voltar ao menu',
                    deactivate: 'Desativar o assistente (falar com humano)',
                    select: 'Selecionar',
                    hasNoOrderId: 'Não sei meu número de pedido'
                }
            },
            cancel: formLabels.cancelButton,
            submit: formLabels.submitButton
        }
    },
    mutedChats: {
        title: 'Assistentes silenciados',
        list: {
            title: 'Conversas',
            description: {
                withChats: `
                    Selecione abaixo as conversas que você deseja
                    reativar o assistente.
                `,
                withoutChats: `
                    Não existem assistentes silenciados no momento.
                    Use o botão acima para atualizar a lista.
                `
            },
            submit: 'Reativar Selecionados'
        }
    }
};
