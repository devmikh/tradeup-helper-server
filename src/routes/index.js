const express = require('express');
const { getItemInfo } = require('../config/SteamClient');
const { getInventory } = require('../utils/inventory');

const router = express.Router();

router.get('/api/test', (req, res) => {
    res.status(200).json({ data: 'test' });
});

router.post('/api/getItemInfo', async (req, res) => {
    if (req.body.inspect_link) {
        getItemInfo(req.body.inspect_link)
            .then((item) => {
                clearTimeout(t);
                res.status(200).json(item);
            })
            .catch((err) => {
                clearTimeout(t);
                console.error(err);
                res.status(500).json(err);
            });

        // If inspecting takes 5 seconds, send error
        const t = setTimeout(() => {
            res.status(500).json({ error: 'inspect_item_timed_out'});
        }, 5000);
    } else {
        res.status(404).json({ error: 'inspect_link_missing' });
    }
});

router.get('/api/getInventory/:id', async (req, res) => {
    const result = await getInventory(req.params.id);
    res.status(200).json({ ...result });
});

module.exports = router;