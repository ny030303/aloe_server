var express = require('express');
const User = require('../models/user');
const {db} = require('../models');
var router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage({
  destination: './public/uploads/images',
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + 
  path.extname(file.originalname));
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
    id:  req.body.id,
    pwd:  req.body.pwd,
    name: req.body.name,
    profileimg: ''
  }).then(function(results) {
      res.status(201).json({result: 1});
  }, function(err) {
      next(err);
  });
});

router.post('/upload', upload.any(),(req,res,next) => {
    console.log("file: "+req.file);
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
