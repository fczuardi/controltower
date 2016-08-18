export default function (isLogged, loginParams) {
    if (isLogged) {
        return window.FB.logout();
    }
    return window.FB.login(loginResponse => {
        if (loginResponse.authResponse) {
            console.log('Welcome!');
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, loginParams);
}
