let express = require('express');
let router = express.Router();
let models = require('../models');

// Todo: Add ability to resend verification token.

router.get('/:token', function (req, res, next) {
  models.User.update(
      {
        email_verified: true,
        reset_token: ''
      },
      {
        where: {
          reset_token: req.params.token,
          email_verified: false
        }
      })
    .then((result) => {
      // First element is always number of rows affected
      if (result[0] === 0) {
        throw 'Nothing to update'
      } else {
        req.flash('message', {message: 'Email verified successfully!', type: 'alert-success'});
        res.render('login', {'messages': req.flash('message')})
      }
    })
    .catch(err => {
      res.status(404);
      next();
    })
});

module.exports = router;
