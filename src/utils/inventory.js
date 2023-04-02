const axios = require('axios');

const getInventory = async(steamId) => {
    try {
        const response = await axios.get(process.env.STEAM_INVENTORY_LINK.replace('{steamId}', steamId));
        if (response.status === 200) {
            const items = formatItemsForTradeUps(response.data);
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

const formatItemsForTradeUps = (data) => {
    const acceptedGrades = ['Consumer', 'Industrial', 'Mil-Spec', 'Restricted', 'Classified'];
    const { assets, descriptions } = data;

    const result = assets.map(asset => {
        const description = descriptions.find(d => d.classid === asset.classid && d.instanceid === asset.instanceid);
        const assetGrade = formatGradeString(description.type);
        if (acceptedGrades.includes(assetGrade)) {
            return {
                asset_id: asset.assetid,
                name: description.name,
                icon_url: description.icon_url,
                exterior: formatExteriorString(description.descriptions[0].value),
                grade: assetGrade,
                collection: description.descriptions[4] && formatCollectionString(description.descriptions[4].value),
            }
        }
        
    })
    .filter(Boolean);

    return result;
};

const formatExteriorString = (string) => {
    return string.replace('Exterior: ', '');
}

const formatGradeString = (string) => {
    return string.split(' ')[0];
}

const formatCollectionString = (string) => {
    return string.replace('The ', '');
}

module.exports = {
    getInventory
};