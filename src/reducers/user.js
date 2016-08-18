const signIn = (data, state) => ({
    ...state,
    isLogged: true
});
const signOut = (data, state) => ({
    ...state,
    isLogged: false
});
const setInfo = (data, state) => ({
    ...state,
    id: data.id,
    name: data.name,
    email: data.email
});
export {
    signIn,
    signOut,
    setInfo
};
