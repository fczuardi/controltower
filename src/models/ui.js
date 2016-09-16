const uiModel = {
    namespace: 'ui',
    state: {
        selectedSection: 'home',
        enabledSections: ['home'],
        menu: [
            'home',
            'channels',
            'ecommerce',
            'mutedChats'
        ],
        facebookPages: [],
        selectedMutedUsers: []
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
        }),
        selectMutedUser: (index, state) => ({
            ...state,
            selectedMutedUsers: state.selectedMutedUsers.concat([index])
        }),
        deselectMutedUser: (index, state) => ({
            ...state,
            selectedMutedUsers: state.selectedMutedUsers.filter(i => i !== index)
        })
    }
};

export default uiModel;
