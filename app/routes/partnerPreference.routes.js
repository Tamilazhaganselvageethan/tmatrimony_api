module.exports = app => {
  const partnr_pref = require("../controllers/partnerPreference.controller.js");
  var router = require("express").Router();

  router.post("/", partnr_pref.index); 
  router.get("/:profileId", partnr_pref.info); 
  router.get("/filter/:profileId", partnr_pref.filter);

  app.use('/api/v1.0/partnr_pref', router);
};