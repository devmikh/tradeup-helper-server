const SteamUser = require('steam-user');
const GlobalOffensive = require('globaloffensive');
const dotenv = require('dotenv');
dotenv.config();

const client = new SteamUser();
const csgo = new GlobalOffensive(client);

const logOnClient = () => {
    client.logOn({
        refreshToken: process.env.REFRESH_TOKEN,
    });

    client.on('loggedOn', () => {
        console.log("Steam client logged in successfully");
        client.setPersona(SteamUser.EPersonaState.Online);
        client.gamesPlayed([730]);
    });

    client.on('appLaunched', () => {
        console.log('App is launched');
    });

    client.on('error', function(e) {
        console.log(e);
    });
};

const getItemInfo = (inspectLink) => {
    return new Promise((resolve, reject) => {
        csgo.inspectItem(inspectLink, (item) => {
            resolve(item);
        }, (err) => {
            reject(err);
        });
    });
};

module.exports = { 
    logOnClient,
    getItemInfo
};
