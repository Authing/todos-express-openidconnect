var express = require('express');
var passport = require('passport');
var OpenIDConnectStrategy = require('passport-openidconnect');


const APP_HOST = 'https://testguoqing.authing.cn'; // 替换此处

passport.use(new OpenIDConnectStrategy({
  issuer: APP_HOST,
  authorizationURL: `${APP_HOST}/oidc/auth`,
  tokenURL: `${APP_HOST}/oidc/token`,
  userInfoURL: `${APP_HOST}/oidc/me`,
  clientID: 'APP_ID', // 替换此处
  clientSecret: 'APP_SECRET', // 替换此处
  callbackURL: '/oauth2/redirect',
  scope: [ 'profile' ]
}, function verify(issuer, profile, cb) {
  return cb(null, profile);
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.displayName });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


var router = express.Router();

router.get('/login', passport.authenticate('openidconnect'));

router.get('/oauth2/redirect', passport.authenticate('openidconnect', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login'
}));

router.post('/logout', function(req, res, next) {
  req.logout();
  res.redirect(`${APP_HOST}/login/profile/logout?redirect_uri=${encodeURIComponent('http://localhost:3000/')}`);
});

module.exports = router;
