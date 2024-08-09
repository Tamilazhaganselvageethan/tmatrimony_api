module.exports = app => {
  const matches = require("../controllers/matches.controller.js");
  var router = require("express").Router();

  //router.post("/", profile_mgmt.index);
  //router.get("/info/:profileId", profile_mgmt.info);  
  router.get("/profile_info/:profileId", matches.profileInfo);
  router.post("/set_connection_status", matches.setConnectionStatus);
  router.get("/sent_connection_list/:profileId", matches.sentConnectionList);
  router.get("/received_connection_list/:profileId", matches.receivedConnectionList);
  router.post("/filter", matches.filter);
  router.post("/save_filter", matches.saveFilter);
  router.get("/filter_list/:profileId", matches.getFilterList);
  router.delete("/delete_filter/:filer_id", matches.deleteFilter);
  //router.get();

  app.use('/api/v1.0/matches', router);
};