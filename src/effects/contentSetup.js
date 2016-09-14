/* eslint-disable */
export default function (data, state, send, done) {
    const accessToken = data.authResponse.accessToken;
    $.ajax({
        type: 'GET',
        url: 'https://0nd54zu4hg.execute-api.us-east-1.amazonaws.com/latest/v1/bots/',
        dataType: 'json',
        headers: {
            authorization: 'Bearer ' + accessToken
            // 'Authorization': 'Bearer ' + accessToken
        }
    }).done(response => {
        console.log(response);
        const jsonData = $.parseJSON(response);
        if (jsonData.hasOwnProperty('facebook')) {
            $('#fb-page-id').value = jsonData.facebook.pages[0].id
            $('#fb-page-token').value = jsonData.facebook.pages[0].accessToken
            $('#fb-app-secret').value = jsonData.facebook.app.secret
        }
    });
}
// 0dd802d3-2aaa-4e00-8e97-c4de32fe58f6
