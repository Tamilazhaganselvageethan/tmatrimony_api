module.exports = app => {
  const auth = require("../controllers/auth.controller.js");
  var router = require("express").Router();
  const multer = require('multer');
  // const storage = multer.memoryStorage();
  const storage = multer.diskStorage({

    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  const upload = multer({ storage: storage });

  router.post("/create-token", auth.create_token);
  router.post("/verify-token", auth.verify_token);
  router.post("/login", auth.login);
  router.post("/logout", auth.logout);
  router.post("/signup", auth.signup);
  router.get("/get-profile-info", auth.get_profile_info);
  router.post("/update-profile", auth.update_profile);
  router.post("/update-password", auth.update_password);
  router.post("/minio-poc", auth.minio_poc);
  router.get("/obj-store", auth.obj_store);
  router.get('/image/*', auth.getImage);
  // router.post('/upload-image', upload.single('image'), auth.uploadImage);
  // router.put('/update-image', upload.single('image'), auth.updateImage);

  app.use('/api/v1.0/auth', router);
};