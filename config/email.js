module.exports = function (mailer, app) {
  mailer.extend(app, {
    from: 'Drop It <no-reply@tomelliott.io>',
    host: 'smtp.mailgun.org',
    secureConnection: true,
    port: 465,
    auth: {
      user: 'notarealuser',
      pass: 'notarealpassword'
    }
  })
}
