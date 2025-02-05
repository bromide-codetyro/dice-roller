const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('client'));

const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
