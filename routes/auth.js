const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const bcrypt = require('bcrypt');
const {db} = require('../models');

const router = express.Router();

const authOpts = {
  local: {
    usernameField: 'id',
    passwordField: 'pwd'
  },
  kakao: {
    clientID: '--------------------------',
    callbackURL: '/auth/kakao_oauth'
  },
  naver: {
    clientID: '--------------------------',
    clientSecret: '--------------',
    callbackURL: '/auth/naver_oauth'
  },
  google: {
    clientID: '---------------------------------',
    clientSecret: '------------------',
    callbackURL: '/auth/google_oauth'
  },
  redirect: {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  }
};

function passportLoginByThirdparty(info, done) {
  console.log('process :', JSON.stringify(info));
  done(null, info);
}

passport.use('local', new LocalStrategy(authOpts.local, async (id, pwd, done) => {
  try {
    const exUser = await db.users.find({'id': id});
    console.log(exUser);
    // if (exUser) {
    //   const result = await bcrypt.compare(pwd, exUser.pwd);
    //   if (result) {
    //     done(null, exUser);
    //   }
    //   else {
    //     done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
    //   }
    // }
    // else {
    //   done(null, false, {message: '가입되지 않은 회원입니다.'});
    // }
  } catch (error) {
    console.error(error);
    done(error);
  }
}));

passport.use('kakao', new KakaoStrategy(authOpts.kakao, (accessToken, refreshToken, profile, done) => {
  let _profile = profile._json;
  passportLoginByThirdparty({
    'type': 'kakao',
    'id': _profile.id,
    'name': _profile.properties.nickname,
    'email': _profile.id,
    'token': accessToken
  }, done);
}));

passport.use('naver', new NaverStrategy(authOpts.naver, (accessToken, refreshToken, profile, done) => {
  let _profile = profile._json;
  passportLoginByThirdparty({
    'type': 'naver',
    'id': _profile.id,
    'name': _profile.nickname,
    'email': _profile.email,
    'token': accessToken
  }, done);
}));

passport.use('google', new GoogleStrategy(authOpts.google, (accessToken, refreshToken, profile, done) => {
  let _profile = profile._json;
  console.log('google profile: ', _profile);
  let splitProfile = _profile.profile || _profile.sub;
  splitProfile = splitProfile.split('/');
  let googlePlusId = splitProfile[splitProfile.length - 1];
  console.log('google-plus id: ', googlePlusId);
  passportLoginByThirdparty({
    'type': 'google',
    'id': googlePlusId,
    'name': _profile.name,
    'email': _profile.email,
    'token': accessToken
  }, done);
}));

router.post('/local', passport.authenticate('local', authOpts.redirect));

// naver 로그인 / 콜백 연동
router.get('/naver', passport.authenticate('naver'));
router.get('/naver_oauth', passport.authenticate('naver', authOpts.redirect));

// kakao 로그인 / 콜백 연동
router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao_oauth', passport.authenticate('kakao', authOpts.redirect));

// google 로그인 / 콜백 연동
router.get('/google', passport.authenticate('google', {scope: ["profile", "email"]}));
router.get('/google_oauth', passport.authenticate('google', authOpts.redirect));

module.exports = router;
