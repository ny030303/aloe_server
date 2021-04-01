var express = require('express');
const User = require('../models/user');
const {db} = require('../models');
var router = express.Router();

const multer = require('multer')
const upload = multer({dest: 'images/'});

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  // console.log(req.body);
  db.users.insert({ 
    id:  req.body.id,
    pwd:  req.body.pwd,
    name: req.body.name,
    profileimg: ''
  }).then(function(results) {
      console.log('Promise Based Insert Result : ', results);
  }, function(err) {
      console.log('== Rejected\n', err);
  });
});

router.post('/upload', upload.single('profile_img'),(req,res,next) => {
    console.log(req.file);
    res.json(req.file);
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
