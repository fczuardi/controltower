export default function (data, state, send, done) {
    const accessToken = data.authResponse.accessToken;
    $.ajax({
        type: 'POST',
        url: 'https://0nd54zu4hg.execute-api.us-east-1.amazonaws.com/latest/v1/customers/',
        dataType: 'json',
        headers: {
            authorization: 'Bearer ' + accessToken
            // 'Authorization': 'Bearer ' + accessToken
        }
    }).done(responses => {
        console.log(responses);
        send('user:contentSetup', responses, done);
    });
}
