let config = require('../config/config')

module.exports = function (req, file, cb) {
  let error = null

  if (!config.allowedFileTypes.includes(file.extension)) {
    error = 'Invalid file type.'
  }

  cb(error)
}
