const express = require('express');
const app = express();

// app.use(express.json())

// app.get(/sw/, function(req, res) {
//   console.log(`req.path = ${req.path}`)
//   res.sendFile(__dirname + `/build/${req.path}`);
// });

// app.get(/.*\.js/, function(req, res) {
//   console.log(`req.path = ${req.path}`)
//   res.sendFile(__dirname + `/src/${req.path}`);
// });

// app.get(/spa\/.*\.html/, function(req, res) {
//   console.log(`SPA request: ${req.originalUrl}`);
//   res.sendFile(__dirname + `/public/spa/index.html`);

// });

let userIdMap = new Map();
let userKeysMap = new Map();

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const KEY_LENGTH = 20;

function generateNewKey() {
  let result = '';

  for (let i = 0; i < KEY_LENGTH; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return result;
}

function getUserId(username) {
  // console.log(`userIdMap.has(${username}) = ${userIdMap.has(username)}`);
  if (!userIdMap.has(username)) {
    let userId = generateNewKey();
    userIdMap.set(username, userId);
  }
  return userIdMap.get(username);
}

app.get(/.*\.html/, function(req, res) {
  console.log(`MPA request: ${req.originalUrl}`);
  res.sendFile(__dirname + `/views${req.originalUrl}`);
});

app.get(/submit_form/, (req, res) => {
  let success = Math.random() < .5 ? true : false;

  setTimeout(() => {
    if (success) {
      console.log(`Responding: FAIL`);
      res.status(406).send("Your form submission failed. Please try again.");
    } else {
      console.log(`Responding: SUCCESS`);
      res.status(200).send("Your form was successfully submitted.");
    }
  }, 1000);
});

app.get(/getUserId/, (req, res) => {
  let username = req.query.username;
  let userId = getUserId(username);

  // console.log(`userKey = ${userKey}`);
  // console.log(`username = ${username}`);

  res.status(200).send(userId);
});

app.get(/setUserKey/, (req, res) => {
  let username = req.query.username;
  let key = req.query.key;

  // console.log(`setUserKey?username = ${username}`);
  // console.log(req.body);
  userKeysMap.set(username, key);

  res.status(200).send();//.send(userKey);
});

app.get(/getUserKey/, (req, res) => {
  let username = req.query.username;
  let userKey = userKeysMap.get(username);

  console.log(`username = ${username}`);
  console.log(`userKey = ${JSON.stringify(userKey)}`);

  res.status(200).send(userKey);
});

app.post(/sign_(in|up)/, (req, res) => {
  console.log(`Sign-in/up request: ${req.originalUrl}`);
  res.status(200).send(); //('/index.html');

});

app.use(express.static('public'));

// listen for requests :)
process.env.PORT = 8080;
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});