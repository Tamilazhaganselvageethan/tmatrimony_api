module.exports = app => {
  const profile_mgmt = require("../controllers/profileManagement.controller.js");
  var router = require("express").Router();
  const multer = require('multer');
    const storage = multer.memoryStorage();
    // const upload = multer({ storage: storage });
    const upload = multer({
      storage: storage,
      limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
    });

  // router.post("/", profile_mgmt.index);
  router.post("/", upload.single('avatar'), profile_mgmt.index);
  router.get("/info/:profileId", profile_mgmt.info);  
  router.put("/avatar/:profileId", upload.single('avatar'), profile_mgmt.updateAvatar);
  //router.get("/match-info/:matchProfileId", profile_mgmt.matchInfo);

  app.use('/api/v1.0/profile_mgmt', router);
};