const express = require('express')
const bodyParser = require('body-parser')
const store = require('./store')
const app = express()
const https = require('https');
const querystring = require('querystring');
module.exports.init = fetch7Shifts();






function fetch7Shifts() {
  const apiKey = 'BXVEPDT89JSFKDM3TT6LSWD5KBR3WHCH';

  let options = {
      host         : 'api.7shifts.com',
      path         : '/v1/shifts/?',
      method       : 'GET',
      auth         : apiKey + ":",
      //username   : 'BXVEPDT89JSFKDM3TT6LSWD5KBR3WHCH',
      //password   : '',
      //apikey       : 'BXVEPDT89JSFKDM3TT6LSWD5KBR3WHCH',
      headers      : {
                        //'Authorization' : 'Basic ' + apiKey + ":",
                        //'Content-type' : 'application/json'
          }
      };

  let req = https.request(options, (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);
      res.on('data', (d) => {
          process.stdout.write(d);
      });
      req.on('error', (e) => {
          console.error(e);
      });


      //res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          console.log(parsedData);
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });

  req.end();

  //console.log(req)
  return req;
}



function buildURL() {

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
  }
  var baseURL = 'https://api.7shifts.com';

  // Limit must be < 500, // date format: YYYY-MM-DD // deep=1 returns assoc. objs like User info
  var startDate = 'start[gte]=' + yyyy + '-' + mm + '-' + dd - 1,
    endDate = '&start[lte]=' + yyyy + '-' + mm + '-' + dd,
    limit = '&limit=500',
    includeAssocObjs = '&deep=1',
    excludeOpenShifts = '&open=0',
    excludeDeletedShifts = '&deleted=0';

  var queries = //startDate + endDate + limit + includeAssocObjs + excludeOpenShifts + excludeDeletedShifts,
    url = baseURL // + queries;

  return url;
}

function parseJSON( response ) {
// Parse JSON string to JSON Obj
  var jsonString = response.getContentText();
  var jsonObj = JSON.parse( jsonString );

  return jsonObj;
}






app.use(express.static('public'))
app.use(bodyParser.json())
app.post('/createUser', (req, res) => {
  store
    .createUser({
      username: req.body.username,
      password: req.body.password
    })
    .then(() => res.sendStatus(200))
})
app.post('/login', (req, res) => {
  store
    .authenticate({
      username: req.body.username,
      password: req.body.password
    })
    .then(({ success }) => {
      if (success) res.sendStatus(200)
      else res.sendStatus(401)
    })
})
app.listen(7555, () => {
  console.log('Server running on http://localhost:7555')
})
