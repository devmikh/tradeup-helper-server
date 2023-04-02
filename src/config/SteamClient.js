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

        // test multiple
        // const inspectLinks = [
        //     'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198029950371A29453725281D7640427423984923410',
        //     'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198029950371A29453709422D14124571290585998863',
        //     'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198029950371A29453625622D14124571290585998863',
        //     'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198029950371A29453600067D16735482347916772680',
        //     'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198029950371A29453582622D5624541058539106296',
        //     'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198029950371A29453573570D14124571290585998863',
        //     'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198029950371A29453563273D5624541058539106296',
        //     'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198029950371A29453553338D12405309084730833974',
        //     'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198029950371A29453530433D12574758976370273397',
        //     'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198029950371A29453510192D5624541058539106296'
        // ];

        // (async () => {
        // for (let i = 0; i < inspectLinks.length; i++) {
        //     try {
        //         const item = await getItemInfo(inspectLinks[i]);
        //         console.log(`Item ${i+1}:`, item);
        //         await new Promise(resolve => setTimeout(resolve, 500));
        //     } catch (err) {
        //         console.error(`Error inspecting item ${i+1}:`, err);
        //     }
        // }
        // })();

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
