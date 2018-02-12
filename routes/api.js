let express = require('express');
let router = express.Router();
let multerFilter = require('../config/multer');
let multer = require('multer');
let gcs = require('multer-gcs');
let models = require('../models');
let base62 = require('url-shortener');

let bucketName = 'dropit-56b16.appspot.com';
let projectId = 'dropit-56b16';
let keyFilename = './dropit-1e6c41fa08ec.json';

let storage = gcs({
  bucket: bucketName,
  projectId: projectId,
  keyFilename: keyFilename,
  acl: 'publicRead',
  preProcess: multerFilter
});

let gcsUpload = multer({storage: storage});
let uploadSingle = gcsUpload.single('image');

router.post('/upload', function (req, res) {
  uploadSingle(req, res, async function (err) {
      if (err) {
          respondUploadError(err, res);
      } else {

          upload = await models.Upload.create({
              UserId: req.user ? req.user.id : null,
              path: req.file.path
          });

          try {
              upload = await upload.updateAttributes({slug: base62.encode(upload.id)});
              respondUploadSuccess(upload, req, res);
          } catch (err) {
              respondUploadError(err, res)
          }
      }
  })
});

router.get('/uploads', verifyAuth, async function(req, res){

  let uploads = await models.Upload.findAll({
    where: { UserId: req.user.id },
    attributes: ['path', 'slug', 'views', 'createdAt']
  });

  let uploadPayload = [];

  uploads.forEach(upload => {
    uploadPayload.push(upload.uploadPayload())
  });

  res.status(200).json({'uploads': uploadPayload});

});

router.get('/uploads/:slug', async function(req, res){

  // More hokieness until I get routing working
  let uploads = [];
  let uploadId;

  try {
    uploadId = base62.decode(req.params.slug)
  } catch (e) {
    res.status(404)
    next()
  }

  upload = await models.Upload.findById(uploadId, {
    attributes: ['id', 'path', 'slug', 'views', 'createdAt'] });

  try {
    await upload.updateAttributes({ views: ++upload.views });
  } catch (e) {
    res.status(404)
    next()
  }

  uploads.push(upload.uploadPayload());
  res.status(200).json({'uploads': uploads})

});


// Todo: Track anon visitors to allow deletion/recovery of images
// router.delete('/uploads/:slug', function(req, res, next){
//   console.log(req.params.slug, 'selected for deletion')
//   console.log(base62.decode(req.params.slug))
//   models.Upload.destroy({ where: { id: base62.decode(req.params.slug) } }).then(() => {
//     res.status(200).send()
//   }).catch((error) => {
//     res.status(400).send()
//   })
// });

function respondUploadSuccess(upload, req, res){
  let response = {
    status: 200,
    message: 'Success'
  };

  Object.assign(response, upload.uploadPayload())

  res.send(response)
}

function respondUploadError(err, res){
  let response = {};

  response.status = 400;
  response.message = err;
  console.log(`Error during upload: ${err}`);
  res.send(response);
}

function verifyAuth(req, res, next){
  if(!req.isAuthenticated()){
    res.redirect('/')
  } else {
    next()
  }
}

module.exports = router;
