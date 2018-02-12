let express = require('express');
let router = express.Router();
let models = require('../models');
let validators = require('../lib/helpers/node-validators');
let title = 'DropIt - Reset Password';

router.post('/:token', async function(req, res, next){

  let user = await models.User.findOne({where: {reset_token: req.params.token}});

  let formStatus = {
    hasErrors(){
      return Boolean(this.passwordError || !this.passwordsMatch || this.otherErrors.length > 0);
    },
    successMessage: '',
    passwordError: false,
    passwordsMatch: false,
    otherErrors: []
  };

  if (!user){
    formStatus.otherErrors.push('Invalid password reset token.');
  } else {
    let password = req.body['password'];

    let passwordErrors = validators.complexity(password);

    formStatus.passwordError = passwordErrors.length > 0;
    formStatus.passwordsMatch = validators.match(password, req.body['password-again']);

    if (!formStatus.hasErrors()){
      try {
        await user.updateAttributes({
          reset_token: '',
          password: models.User.generateHash(password)
        });

        if (req.isAuthenticated()){
          req.logOut();
          req.session.destroy();
        }

        formStatus.successMessage = 'Password reset successfully!';

      } catch (err) {
        formStatus.otherErrors.push('An unexpexted error occurred.');
      }
    }
  }

  res.send(formStatus);
});

router.get('/:token', async function (req, res, next) {

  let user = await models.User.findOne({where: {reset_token: req.params.token}});

  if (!user){
    req.flash('message', {message: 'Invalid password reset token.', type: 'alert-warning'});
    return res.redirect('/forgot');
  }

  res.render('reset', {title: title, csrfToken: req.csrfToken(), messages: req.flash('message')});

});

module.exports = router;
