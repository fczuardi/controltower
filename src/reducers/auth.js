const signIn = (data, state) => ({
    ...state,
    isLogged: true
});
const signOut = (data, state) => ({
    ...state,
    isLogged: false
});

export {
    signIn,
    signOut
};
