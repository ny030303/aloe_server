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

router.post('/invite', async (req, res, next) => {
    // g_id=가입할 그룹, u_id=가입할 유저 
    let obg_id = new ObjectId(req.body.g_id);
    // console.log(req.body);
    try {
        let userInfo = await db.users.findOne({ "_id": new ObjectId(req.body.u_id)});
        let addUser = {'_id': new ObjectId(userInfo._id), 'profileURL': userInfo.profileURL, 'name': userInfo.name};
        console.log(addUser);
        let updateRes = await db.group.updateOne(
            { "_id": obg_id},
            { "$addToSet": { 
                "users": addUser
            }} , {multi: true, upsert: true}
        );
        console.log(updateRes.modifiedCount);
        if(updateRes.modifiedCount > 0) {
            res.json({result: 1, msg: "그룹에 초대됐습니다."});
            
            const {newUser} = require('../socket');
            newUser(obg_id, addUser);
        } else {
            res.json({result: 0, msg: "이미 소속된 그룹입니다."});
        }
        // console.log(updateRes.modifiedCount);
    } catch (error) {
        console.log(error);
        res.json({result: 0, msg: "db 오류가 발생했습니다."});
    }
    // console.log(req.params);
    // res.json(groupInfo);
});

module.exports = router;