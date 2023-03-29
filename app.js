const express = require('express');
const cors = require('cors');

const router = require('./src/routes');
const { logOnClient } = require('./src/config/SteamClient');

// Load env variables
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(router);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server listening on port ${process.env.SERVER_PORT}`);
    logOnClient();
});
