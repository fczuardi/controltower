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
        selectBot: (botId, state) => ({
            ...state,
            selectedBot: botId
        }),
        selectReply: (replyKey, state) => ({
            ...state,
            selectedReply: replyKey
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
