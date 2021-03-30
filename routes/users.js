var express = require('express');
const User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function (req, res, next) {
  res.status(200).json( {"message": "success"});
});


router.post('/signup', async (req, res, next) => {
  console.log(req.body);

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
});

module.exports = router;
