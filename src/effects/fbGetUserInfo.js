export default function (userFields, send, done) {
    const errorHandler = err => (err ? done(err) : null);
    window.FB.api(`/me?fields=${userFields}`, response => {
        console.table(response);
        send('user:setInfo', response, errorHandler);
    });
}
