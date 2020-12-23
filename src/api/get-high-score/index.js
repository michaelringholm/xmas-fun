const AWS = require("aws-sdk");
const UUID = require('uuid');

// Callback is (error, response)
exports.handler = function(event, context, callback) {
    console.log(JSON.stringify(event));
    //AWS.config.update({region: 'eu-central-1'});
    var method = event.requestContext.http.method;
    if(method == "OPTIONS") {
        respondOK({}, callback);
        return;
    }
    console.log("method="+method);

    /*ATV.validateAccessToken(userInfo.userName, userInfo.accessToken, function(valid, reason) {
        if(!valid) respondError(401, reason, callback);
    });*/

    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    //var login = JSON.parse(event.body);    
    /*var params = {
      TableName: 'xmas-fun-high-score',
      Key: {
        'userName': {S: login.userName}
      },
      //ProjectionExpression: 'ATTRIBUTE_NAME'
    };
    
    ddb.getItem(params, function(err, userData) {
       if (err) { console.log(err); respondError(500, err, callback); }
       else {
            console.log(JSON.stringify(userData));
            if(userData == null || userData.Item == null || userData.Item.password == null) {
                console.error("User [" + login.userName + "] not found");
                respondError(401, "Invalid login", callback);
            }
            else {
                if(userData.Item.password.S == login.password) {
                    console.log("Password accepted");
                    updateToken(login, userData.Item.userGuid.S, ddb, callback);
                }
                else {
                    console.error("Wrong password, was [" + login.password + "] exptected [" + userData.Item.password.S + "]");
                    respondError(401, "Invalid login", callback);
                }
            }
       }
    });*/

    var params = {
        TableName: 'xmas-fun-high-score'
    };
      
    ddb.scan(params, function(err, data) {
        if (err) { console.log(err); respondError(500, err, callback); }
        else {
            respondOK(data.Items, callback);
          //console.log("Success", data.Items);
          /*data.Items.forEach(function(element, index, array) {
            console.log(element.Title.S + " (" + element.Subtitle.S + ")");
          });*/
        }
    });

};

function respondOK(data, callback) {
    const response = {
        statusCode: 200,
        body: JSON.stringify({ response: 'Got high score', data: data }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : "*", // Required for CORS support to work
            'Access-Control-Allow-Credentials' : true, // Required for cookies, authorization headers with HT
            'Access-Control-Allow-Headers' : "content-type"
        },
    };
    callback(null, response);
}

function respondError(errorCode, errorMessage, callback) {
    const response = {
        statusCode: errorCode,
        body: JSON.stringify({ response: errorMessage }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : "*", // Required for CORS support to work
            'Access-Control-Allow-Credentials' : true, // Required for cookies, authorization headers with HT
            'Access-Control-Allow-Headers' : "content-type"
        },
    };
    callback(null, response);
}
