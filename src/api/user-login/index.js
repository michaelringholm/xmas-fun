const AWS = require("aws-sdk");
const UUID = require('uuid');
const MAX_TURNS = 10;

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

    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    var login = JSON.parse(event.body);
    
    var params = {
      TableName: 'xmas-fun-login',
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
                    updateToken(login, userData.Item.userGuid.S, ddb, function() {
                        getUserScore(userData.Item.userGuid.S, function(data) {
                            data.maxTurns = MAX_TURNS;
                            respondOK(data, callback);
                        });
                    });
                }
                else {
                    console.error("Wrong password, was [" + login.password + "] exptected [" + userData.Item.password.S + "]");
                    respondError(401, "Invalid login", callback);
                }
            }
       }
    });
};

function updateToken(login, userGuid, ddb, callback) {
    var newToken = UUID.v4();
    var params = {
        TableName: 'xmas-fun-login',
        Item: {
          'userName': {S: login.userName},
          'userGuid': {S: userGuid},
          'password': {S: login.password},
          'accessToken': {S: newToken}
        },
        ReturnConsumedCapacity: "TOTAL", 
        //ProjectionExpression: 'ATTRIBUTE_NAME'
    };    
    ddb.putItem(params, function(err, userData) {
        if (err) { console.log(err); respondError(500, err, callback); }        
        console.log("New token generated");
        respondOK({ "accessToken": newToken, "userGuid": userGuid }, callback);     
    });    
}

function getUserScore(userGuid, callback) {
    //AWS.config.update({region: 'eu-central-1'});
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    
    var params = {
      TableName: 'xmas-fun-score',
      Key: {
        'userGuid': {S: userGuid}
      },
      //ProjectionExpression: 'ATTRIBUTE_NAME'
    };
    
    ddb.getItem(params, function(err, userData) {
       if (err) { console.error(err); throw err; }
       else {
            if(userData == null || userData.Item == null || userData.Item.score == null)
                callback({}); // First round no data yet
            else
                callback(userData.Item);
       }
    });
}

function respondOK(data, callback) {
    const response = {
        statusCode: 200,
        body: JSON.stringify({ response: 'Login completed', data: data }),
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
