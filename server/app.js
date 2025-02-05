const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('client'));

const port = process.env.PORT || 3000;

// const options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// };
//
// https.createServer(options, app).listen(port, () =>
//   console.log(`HTTPS server running on port ${port}`)
// );

app.listen(port, () => console.log(`Listening on port ${port}`));
