let config = {
    appSecret: 'notarealsecret',
    allowedFileTypes: [
        'png',
        'jpg',
        'jpeg',
        'gif'
    ]
};

if (process.env.NODE_ENV === 'production') {
  config.appHost = 'dropit.us'
} else {
  config.appHost = 'localhost:8080'
}

module.exports = config;
