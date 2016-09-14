const uiModel = {
    namespace: 'ui',
    state: {
        selectedSection: 'home',
        enabledSections: ['home'],
        menu: [
            'home',
            'channels'
        ]
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
        })
    }
};

export default uiModel;
