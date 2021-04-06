const express = require('express');
const iconv = require('iconv-lite');
const User = require('../models/user');
const {db} = require('../models');
const fs = require('fs');
const router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage({
  destination: './public/uploads/images',
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.${file.originalname.split('.').pop()}`);
  }
});

const upload = multer({
  storage: storage
});

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', async (req, res, next) => {
  // console.log(req.body);

  await db.users.insert({
    id: req.body.id,
    pwd: req.body.pwd,
    name: req.body.name,
    profileimg: ''
  }).then(function (results) {
    res.status(201).json({result: 1});
  }, function (err) {
    next(err);
  });
});

router.post('/upload', (req, res, next) => {
  console.log(req.body);
  let data = req.body.img.split(';');
  let file = Buffer.from(data[1].substr(7), 'base64');
  let fileName = `${Date.now()}.${data[0].split('/').pop()}`;
  fs.writeFileSync('./public/uploads/images/' + fileName, file);
  // const uploadedFiles = req.files;
  res.json({'fileName': fileName});
});

// try {
//   const user = await User.create({
//     id: req.body.id,
//     pwd: req.body.pwd,
//     name: req.body.name,
//     birth: req.body.birth,
//     profileimg: req.body.profileimg,
//     memo: req.body.memo
//   });
//   console.log(user);
//   res.status(201).json(user);
// } catch (err) {
//   console.error(err);
//   next(err);
// }

module.exports = router;
