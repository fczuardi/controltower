const calamarSetup = config => (send, done) => {
    const { appId } = config;

    $.ajax({
        type: "POST",
        url: "http://dashboard.calamar.io/v1/customers/",
        dataType: "json",
        headers: {
            "authorization:": "Bearer " + state.user.token
        }
    })

    $.ajax({
      type: "GET",
      url: "http://dashboard.calamar.io/v1/bots/" + botId,
      dataType: "json",
      headers: {
          "authorization:": "Bearer " + auth
      }
      success: function(data) {
        var jsonData = $.parseJSON(data);
        if(jsonData.hasOwnProperty('facebook')) {
            $('#fb-page-id').value = jsonData.facebook.pages[0].id
            $('#fb-page-token').value = jsonData.facebook.pages[0].accessToken
            $('#fb-app-secret').value = jsonData.facebook.app.secret
          }
        }
      },
      error: function(error) {
          var json = $.parseJSON(error);
          alert(json.error.message);
      });
};

export default fbSetup;
