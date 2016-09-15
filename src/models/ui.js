const uiModel = {
    namespace: 'ui',
    state: {
        selectedSection: 'home',
        enabledSections: ['home'],
        menu: [
            'home',
            'channels',
            'ecommerce'
        ],
        facebookPages: []
    },
    reducers: {
        enableSection: (name, state) => ({
            ...state,
            enabledSections: state.enabledSections.concat([name])
        }),
        disableSection: (name, state) => ({
            ...state,
            enabledSections: state.enabledSections.filter(item => item !== name)
        }),
        selectSection: (name, state) => ({
            ...state,
            selectedSection: name
        }),
        setFbPages: (facebookPages, state) => ({
            ...state,
            facebookPages
        })
    }
};

export default uiModel;
