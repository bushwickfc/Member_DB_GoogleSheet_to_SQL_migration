const express = require('express')
const request = require('request');
const fs = require('fs');
const app = express();
const store = require('./store.js');

const apiKey = 'BXVEPDT89JSFKDM3TT6LSWD5KBR3WHCH';
var options = {
    url         : 'https://api.7shifts.com' + '/v1/users/?' + buildURL('u'),
    method      : 'GET',
    auth        : {
        username   : apiKey
    }
};

request(options, function (error, response, body) {
  //console.log('error:', error); // Print the error if one occurred
  //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //console.log('body:', body); // Print the HTML for the Google homepage.
  //console.log(typeof body)
  let j = JSON.parse(body);
  parsed = j.data.map(parseSevenShiftsUser)
  store.users(parsed)
  fs.writeFileSync('public/data.json', JSON.stringify(parsed, undefined, 2));
});




function buildURL(deep) {
  if(deep === 'u') return '';
  //Get variables for current date
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
      dd = '0'+dd
  }

  if(mm<10) {
      mm = '0'+mm
  };

  // Limit must be < 500, // date format: YYYY-MM-DD // deep=1 returns assoc. objs like User info
  var startDate = 'start[gte]=' + yyyy + '-' + mm + '-' + (dd - 1).toString(),
    endDate = '&start[lte]=' + yyyy + '-' + mm + '-' + (dd).toString(),
    limit = '' //'&limit=300',
    includeAssocObjs = '&deep=' + deep,
    excludeOpenShifts = '&open=0',
    excludeDeletedShifts = '&deleted=0';

  var queries = startDate + endDate + limit + includeAssocObjs + excludeOpenShifts + excludeDeletedShifts,
    url = queries;

  return url;
}

function parseSevenShiftsUser(userObj){
  const user = userObj.user
  return {sevenShiftsId: user.id,
          firstName: user.firstname,
          lastName: user.lastname,
          mobilePhone: user.mobile_phone,
          email: user.email };
}


//userId, sevenShiftsId, posId, firstName, lastName, email, mobilePhone
function parseJSON( response ) {
// Parse JSON string to JSON Obj
  var jsonString = response.getContentText();
  var jsonObj = JSON.parse( jsonString );

  return jsonObj;
}

app.use(express.static('public'))
app.listen(7555, () => {
  console.log('Server running on http://localhost:7555')
})
