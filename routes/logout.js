let express = require('express')
let router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  req.logOut();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
