const formLabels = {
    cancelButton: 'Cancelar',
    submitButton: 'Enviar'
};

module.exports = {
    login: {
        title: 'Entrada',
        subtitle: 'Para acessar a Torre de Controle é necessário identificar-se.',
        fbSignInButton: 'Acessar com Facebook'
    },
    sidebar: {
        home: 'Home',
        channels: 'Canais',
        ecommerce: 'E-commerce',
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
    mutedChats: {
        title: 'Assistentes silenciados'
    }
};
