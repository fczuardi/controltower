export default function (userFields, send, done) {
    window.FB.api(`/me?fields=${userFields}`, response => {
        console.table(response);
        send('user:setInfo', response, done);
    });
}
