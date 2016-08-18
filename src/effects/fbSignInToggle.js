export default function (isLogged) {
    if (isLogged) {
        return window.FB.logout();
    }
    return window.FB.login(loginResponse => {
        if (loginResponse.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            window.FB.api('/me', response => {
                console.log(`Good to see you, ${response.name}.`);
            });
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    });
}
