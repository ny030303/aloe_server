const express = require('express');
const {db} = require('../models');
const { ObjectId } = require('mongodb');

const router = express.Router();

router.get('/:g_id', async (req, res, next) => {
    let obg_id = new ObjectId(req.params.g_id);
    let groupInfo = await db.group.findOne({ "_id": obg_id});
    console.log(req.params);
    res.json(groupInfo);
});

module.exports = router;