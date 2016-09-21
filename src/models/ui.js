const uiModel = {
    namespace: 'ui',
    state: {
        selectedSection: 'replies',
        enabledSections: ['home', 'replies'],
        menu: [
            'home',
            'channels',
            'ecommerce',
            'replies',
            'mutedChats'
        ],
        facebookPages: [],
        selectedMutedUsers: [],
        selectedReply: 'buttons.talkToHuman'
    },
    reducers: {
        enableSection: (name, state) => (
            state.enabledSections.includes(name) ? state : {
                ...state,
                enabledSections: state.enabledSections.concat([name])
            }
        ),
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
        }),
        setSelectedMutedUsers: (data, state) => ({
            ...state,
            selectedMutedUsers: data
        })
    }
};

export default uiModel;
