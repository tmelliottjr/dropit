let express = require('express');
let router = express.Router();
let title = 'DropIt - Uploads';

router.get('/', verifyAuth, function(req, res, next) {
   res.render('uploads', {'title': title, 'uploadActive': 'active', 'user': getUser(req)})
});

router.get('/:slug', (req, res, next) => {
  res.render('uploads', {'title': title, 'uploadActive': 'active', 'user': getUser(req)})
});

function verifyAuth(req, res, next){
  if(!req.isAuthenticated()){
    res.redirect('/')
  } else {
    next()
  }
}

function getUser(req){
  let user;
  if (req.isAuthenticated()){
    return user = {
      name: req.user.first_name
    }
  }
}

module.exports = router;