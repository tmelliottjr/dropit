let express = require('express');
let router = express.Router();
let title = 'DropIt - Login';

router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/')
  }

  // Todo: Allow user to resent verification token.
  res.render('login', {title: title, 'loginActive': 'active', messages: req.flash('message'), csrfToken: req.csrfToken()})
});

router.post('/', function (req, res, next) {
  req.app.get('passport').authenticate('local-login', function (err, user, info) {
    console.log(info)

    if (info.hasErrors()) {
      info.hasErrors = info.hasErrors();
    } else if (user) {
      req.logIn(user, function(err){
        if (err){
          info.hasErrors = true;
          info.otherErrors.push['Unable to login!'];
        } else{
          info.successMessage = 'Login successful!'
        }

      });

    }

    res.send(info)
  })(req, res, next)
});

module.exports = router;

