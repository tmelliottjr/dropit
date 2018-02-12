let express = require('express');
let router = express.Router();
let title = 'Drop It Image Sharing';

/* GET home page. */
router.get('/', function (req, res, next) {
  let user;
  if (req.isAuthenticated()){
    user = {
      name: req.user.first_name
    }
  }

  let message = '';
  let messageType = '';

  res.render('index', {'title': title, messages: req.flash('message'), 'indexActive': 'active', 'user': user})
});

module.exports = router
