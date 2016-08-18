const signIn = (data, state) => ({
    ...state,
    isLogged: true
});
const signOut = () => ({
    id: null,
    name: null,
    email: null,
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
