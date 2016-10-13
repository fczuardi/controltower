const uiModel = {
    namespace: 'ui',
    state: {
        selectedSection: 'home',
        selectedBot: null,
        enabledSections: ['home', 'debug'],
        menu: [
            'home',
            'channels',
            'ecommerce',
            'intents',
            'replies',
            'mutedChats',
            'admins',
            'debug'
        ],
        facebookPages: [],
        selectedMutedUsers: [],
        selectedReply: 'start'
    },
    reducers: {
        enableSection: (state, name) => (
            state.enabledSections.includes(name) ? state : {
                ...state,
                enabledSections: state.enabledSections.concat([name])
            }
        ),
        disableSection: (state, name) => ({
            ...state,
            enabledSections: state.enabledSections.filter(item => item !== name)
        }),
        selectSection: (state, name) => ({
            ...state,
            selectedSection: name
        }),
        setFbPages: (state, facebookPages) => ({
            ...state,
            facebookPages
        }),
        selectBot: (state, botId) => ({
            ...state,
            selectedBot: botId
        }),
        selectReply: (state, replyKey) => ({
            ...state,
            selectedReply: replyKey
        }),
        selectMutedUser: (state, index) => ({
            ...state,
            selectedMutedUsers: state.selectedMutedUsers.concat([index])
        }),
        deselectMutedUser: (state, index) => ({
            ...state,
            selectedMutedUsers: state.selectedMutedUsers.filter(i => i !== index)
        }),
        setSelectedMutedUsers: (state, data) => ({
            ...state,
            selectedMutedUsers: data
        })
    }
};

export default uiModel;
