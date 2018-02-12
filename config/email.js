module.exports = function (mailer, app) {
  mailer.extend(app, {
    from: 'Drop It <no-reply@dropit.us>',
    host: 'smtp.mailgun.org',
    secureConnection: true,
    port: 465,
    auth: {
      user: 'notarealuser',
      pass: 'notarealpassword'
    }
  })
}
