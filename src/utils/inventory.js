const axios = require('axios');

const getInventory = async(steamId) => {
    try {
        const response = await axios.get(process.env.STEAM_INVENTORY_LINK.replace('{steamId}', steamId));
        if (response.status === 200) {
            const items = formatItemsForTradeUps(response.data, steamId);
            try {
                // UNCOMMENT to retrieve floats as well, then pass itemsWithFloats to data (instead of items)
                // const itemsWithFloats = await getFloatsForItems(items);
                return {
                    data: items,
                    error: null,
                    status: response.status
                }
            } catch(error) {
                return {
                    data: null,
                    error: error.message,
                    status: 500
                }
            }
        } else {
            return {
                data: null,
                error: null,
                status: response.status
            }
        }

    } catch (error) {
        console.error(error);
        return {
            data: null,
            error: error.message,
            status: error.response.status
        }
    }    
};

const getFloatsForItems = async (items) => {
    const linksToInspect = items.map(item => {
        return {
            link: item.inspect_link
        }
    });

    const data = JSON.stringify({ links: (linksToInspect)});
    var config = {
        method: 'post',
        url: process.env.FLOAT_INSPECT_URL_BULK,
        headers: { 
          'Content-Type': 'application/json'
        },
        data: data
    };
    const response = await axios(config);
    const itemsWithFloats = items.map(item => {
        return {
            ...item,
            float: response.data[item.asset_id].floatvalue
        }
    });
    return itemsWithFloats;
};

const formatItemsForTradeUps = (data, steamId) => {
    const acceptedGrades = ['Consumer', 'Industrial', 'Mil-Spec', 'Restricted', 'Classified'];
    const { assets, descriptions } = data;

    const result = assets.map(asset => {
        const description = descriptions.find(d => d.classid === asset.classid && d.instanceid === asset.instanceid);
        const assetGrade = formatGradeString(description.type);
        if (acceptedGrades.includes(assetGrade)) {
            const inspectLink = description.actions[0].link;

            return {
                asset_id: asset.assetid,
                name: description.name,
                icon_url: description.icon_url,
                exterior: formatExteriorString(description.descriptions[0].value),
                grade: assetGrade,
                collection: description.descriptions[4] && formatCollectionString(description.descriptions[4].value),
                inspect_link: inspectLink.replace('%owner_steamid%', steamId).replace('%assetid%', asset.assetid),
                float: 0.099989786976,
                selected: false
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