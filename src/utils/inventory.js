const axios = require('axios');

const getInventory = async(steamId) => {
    try {
        const response = await axios.get(`${process.env.STEAM_INVENTORY_LINK}/${steamId}/730/2`);
        if (response.status === 200) {
            const items = formatItems(response.data);
            return {
                data: items,
                error: null
            }
        } else {
            return {
                data: null,
                error: null
            }
        }

    } catch (error) {
        return {
            data: null,
            error
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