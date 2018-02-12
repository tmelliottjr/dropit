let express = require('express')
let router = express.Router()

router.route('/')
.get(function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/')
  }
  res.render('register', {
      title: 'DropIt - Register',
      'registerActive': 'active',
      csrfToken: req.csrfToken()
  })
})
.post(function (req, res, next) {
  req.app.get('passport').authenticate('local-signup', function(err, user ,info){
      info.hasErrors = info.hasErrors();
      res.send(info)
  })(req, res, next)
});


// .post(function (req, res, next) {
//   req.app.get('passport').authenticate('local-signup', {
//     successRedirect: '/',
//     failureRedirect: '/register',
//     failureFlash: true,
//     session: false
//   })(req, res, next)
// });

module.exports = router;
