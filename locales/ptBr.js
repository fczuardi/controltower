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
                start: 'Menu inicial',
                trackOrder: 'Status do pedido',
                receipt: 'Nota fiscal',
                returns: 'Trocas e Devoluções',
                talkToHuman: 'Falar com um humano',
                thanks: 'Agradecimento',
                buttons: {
                    title: 'Botões',
                    printReceiptLink: 'Segunda Via',
                    backToMenu: 'Voltar ao Menu',
                    trackOrder: 'Rastrear Pedido',
                    returnsSubmenu: 'Trocas e Devoluções (submenu)',
                    returnsLink: 'Trocas e Devoluções (link)',
                    talkToHuman: 'Falar com um Humano'
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
