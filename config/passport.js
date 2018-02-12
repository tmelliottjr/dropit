let LocalStrategy = require('passport-local').Strategy;
let models = require('../models');
let validators = require('../lib/helpers/node-validators');

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

passport.deserializeUser(function (id, done) {
  models.User.findOne({where: {id: id}})
    .then(user => {done(null, user);})
    .catch(err => done(err, null));
});

  // Local Login
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, email, password, done) {
    process.nextTick( async function(){

      let user = '';
      let formStatus = {
        hasErrors(){
          return Boolean(this.emailErrors.length > 0 || this.passwordError !== '' || this.otherErrors.length > 0);
        },
        successMessage: '',
        emailErrors: [],
        passwordError: '',
        otherErrors: []
      };

        try {
          user = await models.User.findOne({where: {email: email}});
        } catch (err){
          formStatus.otherErrors.push('An unexpected error occurred.')
        }
        if (user) {
          if (!user.email_verified) {
            formStatus.emailErrors.push('Please verify your email address to log in.')
          }

          if (!user.validPassword(password)) {
            formStatus.passwordError = 'Invalid password.';
          }
        } else {
          formStatus.emailErrors.push('Account not found.');
        }
        return done(null, formStatus.hasErrors() ? null : user, formStatus)
    })
}));

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, password, done) {
    process.nextTick(async function () {

      let user = '';
        let formStatus = {
            hasErrors(){
                return Boolean(this.emailErrors.length > 0 || this.passwordError || !this.passwordsMatch || this.otherErrors.length > 0);
            },
            successMessage: '',
            emailErrors: [],
            passwordError: false,
            passwordsMatch: false,
            otherErrors: []
        };

        user = await models.User.findOne({
            where: {
                email: email
            }
        });

        if (user) {
            formStatus.emailErrors.push('Email address already in use.');
        }

        if (!validators.validateEmail(email)){
            formStatus.emailErrors.push('Invalid email address.');
        }

        let passwordErrors = validators.complexity(password);
        formStatus.passwordError = passwordErrors.length > 0;
        formStatus.passwordsMatch = validators.match(password, req.body['password-again']);

        if (!formStatus.hasErrors()){
          try {
            user = await models.User.create({
              email: email,
              password: models.User.generateHash(password),
              reset_token: models.User.generateToken()
            });
          } catch (err) {
            formStatus.otherErrors.push('An unexpected error has occurred.');
          }

          let message = '';
          let type = '';

          if (user){
            try {
              user.sendVerificationEmail(req);
              formStatus.successMessage = `A verification email has been sent to ${email}`;
            } catch (err) {
              formStatus.otherErrors.push(`Unable to send verification email to ${email}`);
            }
          } else {
            formStatus.otherErrors.push('An unexpected error has occurred.');
          }
        }

        return done(null, formStatus.hasErrors() ? null : user, formStatus);
    })
}))};