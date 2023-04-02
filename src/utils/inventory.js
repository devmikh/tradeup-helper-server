const axios = require('axios');

const getInventory = async(steamId) => {
    try {
        const response = await axios.get(process.env.STEAM_INVENTORY_LINK.replace('{steamId}', steamId));
        if (response.status === 200) {
            const items = formatItems(response.data);
            return {
                data: items,
                error: null,
                status: response.status
            }
        } else {
            return {
                data: null,
                error: null,
                status: response.status
            }
        }

    } catch (error) {
        return {
            data: null,
            error: error.message,
            status: error.response.status
        }
    }    
};

const formatItems = (data) => {
    const { assets, descriptions } = data;
    const result = assets.map(asset => {
        const description = descriptions.find(d => d.classid === asset.classid && d.instanceid === asset.instanceid);
        return {
            asset_id: asset.assetid,
            name: description.name,
            icon_url: description.icon_url,
            exterior: description.descriptions[0].value,
            type: description.type,
            collection: description.descriptions[4] && description.descriptions[4].value,
        }
    });
    return result;
};

module.exports = {
    getInventory
};