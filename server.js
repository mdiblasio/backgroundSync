const express = require('express');
const app = express();

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

app.get(/.*\.html/, function(req, res) {
  // console.log(`MPA request: ${req.originalUrl}`);
  res.sendFile(__dirname + `/views/index.html`);
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

app.use(express.static('public'));

// listen for requests :)
process.env.PORT = 8080;
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});