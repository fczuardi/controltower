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
        home: 'Início',
        channels: 'Canais',
        ecommerce: 'Comércio',
        intents: 'Frases',
        replies: 'Respostas',
        mutedChats: 'Assistentes silenciadas',
        admins: 'Equipe',
        debug: 'Depuração'
    },
    footer: {
        appName: version => `• Control Tower v${version} •`,
        viewSource: 'ver código-fonte'
    },
    signInToggle: {
        signIn: 'Entrar',
        signOut: 'Sair'
    },
    home: {
        title: 'Início',
        description: 'Escolha qual assistente configurar'
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
            selectAPage: 'Selecione uma',
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
                    status de pedidos.
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
    intents: {
        title: 'Reconhecimento de Frases',
        faq: {
            title: 'Perguntas Frequentes',
            description: `
                Cadastre abaixo alguns temas de perguntas que sua
                assistente pode responder por você. Um tema é um
                conjunto de perguntas cuja resposta é a mesma. 
            `,
            intentList: 'Temas',
            addIntentOption: 'Novo tema',
            existingIntents: 'Temas cadastrados',
            intentName: 'Tema',
            newUterranceTitle: 'Nova Pergunta',
            addUtteranceButton: 'Adicionar Pergunta',
            utterances: 'Perguntas',
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
            selectAReply: 'Selecione uma resposta',
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
                    deactivate: 'Desativar a assistente (falar com humano)',
                    select: 'Selecionar',
                    hasNoOrderId: 'Não sei meu número de pedido'
                }
            },
            cancel: formLabels.cancelButton,
            submit: formLabels.submitButton
        }
    },
    mutedChats: {
        title: 'Assistentes silenciadas',
        list: {
            title: 'Conversas',
            description: {
                withChats: `
                A lista abaixo é de conversas onde a função assistente
                não conseguiu resolver a tarefa sozinha e foi silenciada
                para que uma pessoa pudesse intervir.
                `,
                withoutChats: `
                    Não existem assistentes silenciadas no momento.
                    Use o botão acima para atualizar a lista.
                `
            },
            submit: 'Reativar Selecionadas'
        }
    },
    debug: {
        title: 'Depuração'
    },
    admins: {
        title: 'Equipe de admnistração',
        team: {
            title: 'Integrantes',
            name: 'Nome',
            email: 'Email'
        },
        invite: {
            title: 'Aumentar a equipe',
            instructions: [
                'Para convidar uma nova pessoa para a equipe de '
                + 'admnistração, compartilhe o endereço do convite '
                + 'e o código com ela.',
                'Para invalidar um convite clique no botão "Gerar nova chave".'
            ],
            url: 'Endereço',
            inviteCode: 'Código do convite',
            newKey: 'Gerar nova chave'
        }
    },
    invite: {
        title: 'Você foi convidado',
        subtitle: id => `para admnistrar o assistente ${id}`,
        description: 'Digite o código de convite abaixo para aceitar',
        submitButton: 'Aceitar',
        ignoreButton: 'Ignorar'
    }
};
