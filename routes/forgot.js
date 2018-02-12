let express = require('express');
let router = express.Router();
let models = require('../models');
let title = 'DropIt - Forgot Password';


router.get('/', function (req, res, next) {

  if (req.isAuthenticated()) {
    res.redirect('/')
  }

  res.render('forgot', {title: title, messages: req.flash('message'), csrfToken: req.csrfToken()})
});

router.post('/', async (req, res, next) => {

  let user = await models.User.findOne({where: {email: req.body.email}});

  let formStatus = {
    hasErrors(){
      return Boolean(this.emailErrors.length > 0 || this.otherErrors.length > 0);
    },
    successMessage: '',
    emailErrors: [],
    otherErrors: []
  };

  if (user){

    if (!user.email_verified){
      formStatus.emailErrors.push('Account not activated.');
    } else {
      user = await user.updateAttributes({
        reset_token: models.User.generateToken()
      });

      user.sendPasswordResetEmail(req); // Todo: Convert to promise

      formStatus.successMessage = `A password reset link has been sent to ${user.email}.`
    }
  } else {
    formStatus.emailErrors.push('Invalid email address.')
  }

  formStatus.hasErrors = formStatus.hasErrors();
  res.send(formStatus);

});

module.exports = router;
