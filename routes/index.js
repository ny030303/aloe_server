var express = require('express');
// const passport = require('passport');
// const bcrypt = require('bcrypt');
const fs = require('fs');
var path = require('path');
// const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // console.log(req.user);
  if(req.user) { // 유저 로그인 중
    res.status(201).json({result: req.user});
  } else {
    res.status(201).json({result: 0});
  }
});

const mimeTypes = {
  'png': 'image/png',
  'jpg': 'image/jpg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'wav': 'audio/wav',
  'mp4': 'video/mp4',
  'json': 'application/json'
};

router.get('/images/:fileName', function (req, res, next) {
  // __dirname.split('router')[0] + 'public/uploads/images/' + req.params.fileName
  let extname = String(req.params.fileName.split('.')[1].toLowerCase()); // ex. jpg, jpeg
  let contentType = mimeTypes[extname];
  fs.readFile('public/uploads/images/' + req.params.fileName, function (err, result) {
    if (err) {
      res.next(err);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(result, 'utf-8');
    }
  });

});

module.exports = router;
