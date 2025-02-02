import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const staticPath = path.join(__dirname, "../../", "client/public");
console.log(staticPath);
app.use(express.static(staticPath));

const port = 3000;
app.listen(port, () => console.log(`Running on port ${port}`));
